import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

const CATEGORIES = [
  'SSC Preparation', 'UPSC/IAS', 'Banking Exams', 'Railway RRB',
  'TET/CTET', 'Police Exams', 'NEET', 'JEE/GATE', 'Defence/NDA',
  'State PCS', 'Academic', 'Computer & Tech', 'Beauty & Makeup',
  'Silai & Fashion', 'Digital Marketing', 'Cooking', 'Art & Craft',
  'Business', 'Language', 'Photography', 'Agriculture', 'Healthcare',
  'Communication & Personality', 'Jewelry Making', 'Hair & Grooming'
]

export default function BookStore() {
  const [books, setBooks] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [language, setLanguage] = useState('')

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
    (category === '' || b.category === category) &&
    (language === '' || b.language === language)
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
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-orange-500">🎓 SkillClass</Link>
          <h2 className="text-lg font-semibold text-gray-700">📚 Book Store</h2>
          <Link to="/student/dashboard" className="px-4 py-2 text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50">
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 py-10 text-center text-white">
        <h1 className="text-3xl font-bold mb-2">📚 SkillClass Book Store</h1>
        <p className="text-orange-100">Government Exams, Skills aur bahut kuch — PDF Books ek jagah!</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Book search karo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
          >
            <option value="">All Languages</option>
            <option>Hindi</option>
            <option>English</option>
            <option>Hindi + English</option>
          </select>
        </div>

        {/* Category Quick Links */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {[
            { icon: '🏛️', name: 'SSC' },
            { icon: '🎖️', name: 'UPSC' },
            { icon: '🏦', name: 'Banking' },
            { icon: '🚂', name: 'Railway' },
            { icon: '🚔', name: 'Police' },
            { icon: '🎓', name: 'TET/CTET' },
          ].map(cat => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name === 'SSC' ? 'SSC Preparation' : cat.name === 'UPSC' ? 'UPSC/IAS' : cat.name === 'Banking' ? 'Banking Exams' : cat.name === 'Railway' ? 'Railway RRB' : cat.name === 'Police' ? 'Police Exams' : 'TET/CTET')}
              className="bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-all hover:bg-orange-50"
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <p className="text-xs font-semibold text-gray-700">{cat.name}</p>
            </button>
          ))}
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
                <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-6xl">
                  📖
                </div>
                <div className="p-4">
                  <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded">{book.category}</span>
                  <h3 className="font-bold text-gray-800 mt-2 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">✍️ {book.author}</p>
                  <p className="text-sm text-gray-500 mb-1">🗣️ {book.language}</p>
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl font-bold text-orange-400 mb-2">🎓 SkillClass Book Store</p>
          <p className="text-gray-400 text-sm">© 2026 SkillClass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}