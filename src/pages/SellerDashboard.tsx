import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function SellerDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [books, setBooks] = useState<any[]>([])
  const [wallet, setWallet] = useState<any>(null)
  const [showUploadBook, setShowUploadBook] = useState(false)
  const [form, setForm] = useState({
    title: '', author: '', category: '', description: '',
    price: '', language: 'Hindi', pdf_url: '', cover_image: ''
  })

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { navigate('/login'); return }
    const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    if (data?.account_type !== 'seller') { navigate('/'); return }
    setUser(data)
    getBooks(authUser.id)
    getWallet(authUser.id)
  }

  const getBooks = async (id: string) => {
    const { data } = await supabase.from('books').select('*').eq('seller_id', id)
    setBooks(data || [])
  }

  const getWallet = async (id: string) => {
    const { data } = await supabase.from('wallets').select('*').eq('user_id', id).single()
    setWallet(data)
  }

  const handleUploadBook = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from('books').insert({
      ...form,
      seller_id: authUser?.id,
      price: parseFloat(form.price),
    })
    setShowUploadBook(false)
    getBooks(authUser?.id || '')
    alert('Book upload ho gayi! Admin approval pending.')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-500">🎓 SkillClass — Seller Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">👋 {user?.full_name}</span>
            <button onClick={handleLogout} className="px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {['overview', 'books', 'earnings', 'payout'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 font-medium capitalize ${activeTab === tab ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Books', value: books.length, icon: '📚' },
              { label: 'Approved Books', value: books.filter(b => b.is_approved).length, icon: '✅' },
              { label: 'Total Earned', value: `₹${wallet?.total_earned || 0}`, icon: '💰' },
              { label: 'Available Balance', value: `₹${wallet?.available_balance || 0}`, icon: '💳' },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Books */}
        {activeTab === 'books' && (
          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">My Books</h2>
              <button
                onClick={() => setShowUploadBook(true)}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                + Upload Book
              </button>
            </div>

            {books.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">📚</div>
                <p>Abhi koi book nahi hai. Pehli book upload karo!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {books.map(book => (
                  <div key={book.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-4xl mb-3">📖</div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800">{book.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${book.is_approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {book.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{book.category}</p>
                    <p className="text-orange-500 font-bold mt-2">₹{book.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Earnings */}
        {activeTab === 'earnings' && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Earnings</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Earned', value: wallet?.total_earned || 0 },
                { label: 'Available Balance', value: wallet?.available_balance || 0 },
                { label: 'Pending Balance', value: wallet?.pending_balance || 0 },
                { label: 'Total Withdrawn', value: wallet?.total_withdrawn || 0 },
              ].map(item => (
                <div key={item.label} className="border rounded-xl p-4">
                  <div className="text-2xl font-bold text-orange-500">₹{item.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payout */}
        {activeTab === 'payout' && (
          <div className="bg-white rounded-xl p-8 shadow-sm max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payout Request</h2>
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-3xl font-bold text-orange-500">₹{wallet?.available_balance || 0}</p>
            </div>
            <form className="space-y-4">
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg">
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
              </select>
              <input type="text" placeholder="UPI ID ya Bank Account" className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
              <input type="number" placeholder="Amount" className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
              <button className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600">
                Payout Request Karo
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Upload Book Modal */}
      {showUploadBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Book Upload Karo</h2>
              <button onClick={() => setShowUploadBook(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleUploadBook} className="space-y-4">
              <input required placeholder="Book Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input required placeholder="Author Name" value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
                <option value="">Category Select Karo</option>
                {['Academic', 'Computer & Tech', 'Beauty & Makeup', 'Silai & Fashion', 'Digital Marketing', 'Cooking', 'Art & Craft', 'Business', 'Language', 'Photography'].map(c => <option key={c}>{c}</option>)}
              </select>
              <textarea required placeholder="Book Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 border rounded-lg" rows={3} />
              <input required placeholder="PDF Link (Google Drive ya any link)" value={form.pdf_url} onChange={e => setForm({...form, pdf_url: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input placeholder="Cover Image Link (optional)" value={form.cover_image} onChange={e => setForm({...form, cover_image: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Price (₹)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                <select value={form.language} onChange={e => setForm({...form, language: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
                  <option>Hindi</option>
                  <option>English</option>
                  <option>Hindi + English</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600">
                Book Upload Karo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}