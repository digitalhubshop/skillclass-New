import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function BookStore() {
  const [books, setBooks] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    getBooks()
  }, [])

  const getBooks = async () => {
    const { data } = await supabase
      .from('books')
      .select('*, users(full_name)')
      .eq('is_approved', true)
    setBooks(data || [])
  }

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || b.category === category)
  )

  const handlePurchase = async (book: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Pehle login karo!'); return }

    const commission = book.price * 0.02
    const sellerAmount = book.price - commission

    await supabase.from('book_purchases').insert({
      student_id: user.id,
      book_id: book.id,
      amount: book.price,
      commission,
      seller_amount: sellerAmount,
    })

    alert('Book purchase successful! My Books mein dekho.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-orange-500">🎓 SkillClass</Link>
          <h2 className="text-lg font-semibold text-gray-700">📚 Book Store</h2>
          <Link to="/student/dashboard" className="px-4 py-2 text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Book search karo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
          >
            <option value="">All Categories</option>
            {['Academic', 'Computer & Tech', 'Beauty & Makeup', 'Silai & Fashion', 'Digital Marketing', 'Cooking', 'Art & Craft', 'Business'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Books Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📚</div>
            <p>Abhi koi book available nahi hai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(book => (
              <div key={book.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="h-48 bg-orange-100 flex items-center justify-center text-6xl">
                  📖
                </div>
                <div className="p-4">
                  <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded">{book.category}</span>
                  <h3 className="font-bold text-gray-800 mt-2 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">✍️ {book.author}</p>
                  <p className="text-sm text-gray-500 mb-3">🛍️ {book.users?.full_name}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-orange-500">₹{book.price}</span>
                    <button
                      onClick={() => handlePurchase(book)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}