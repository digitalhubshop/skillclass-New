import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

const CATEGORIES = [
  'SSC Preparation', 'UPSC/IAS', 'Banking Exams', 'Railway RRB',
  'TET/CTET', 'Police Exams', 'NEET', 'JEE/GATE', 'Defence/NDA',
  'State PCS', 'Academic', 'Computer & Tech', 'Beauty & Makeup',
  'Silai & Fashion', 'Digital Marketing', 'Cooking', 'Art & Craft',
  'Business', 'Language', 'Photography', 'Agriculture', 'Healthcare',
  'Communication & Personality', 'Jewelry Making', 'Hair & Grooming'
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [classrooms, setClassrooms] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    getUser()
    getClassrooms()
  }, [])

  const getUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { navigate('/login'); return }
    const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    setUser(data)
    getEnrollments(authUser.id)
    getPurchases(authUser.id)
  }

  const getEnrollments = async (id: string) => {
    const { data } = await supabase.from('enrollments').select('*, classrooms(*)').eq('student_id', id)
    setEnrollments(data || [])
  }

  const getPurchases = async (id: string) => {
    const { data } = await supabase.from('book_purchases').select('*, books(*)').eq('student_id', id)
    setPurchases(data || [])
  }

  const getClassrooms = async () => {
    const { data } = await supabase.from('classrooms').select('*, users(full_name)').eq('is_approved', true).eq('is_active', true)
    setClassrooms(data || [])
  }

  const filtered = classrooms.filter(cls =>
    cls.name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter === '' || cls.category === categoryFilter)
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-500">🎓 SkillClass — Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">👋 {user?.full_name}</span>
            <button onClick={handleLogout} className="px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 border-b overflow-x-auto">
          {['overview', 'explore', 'my classes', 'my books'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Enrolled Classes', value: enrollments.length, icon: '🏫' },
                { label: 'Purchased Books', value: purchases.length, icon: '📚' },
                { label: 'Completed Classes', value: 0, icon: '✅' },
                { label: 'Total Spent', value: `₹${enrollments.reduce((a, e) => a + (e.amount || 0), 0)}`, icon: '💰' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-bold text-gray-800">{item.value}</div>
                  <div className="text-sm text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '🏛️', label: 'SSC Preparation', cat: 'SSC Preparation' },
                { icon: '🎖️', label: 'UPSC/IAS', cat: 'UPSC/IAS' },
                { icon: '🏦', label: 'Banking Exams', cat: 'Banking Exams' },
                { icon: '🚂', label: 'Railway RRB', cat: 'Railway RRB' },
              ].map(item => (
                <button key={item.label} onClick={() => { setActiveTab('explore'); setCategoryFilter(item.cat) }}
                  className="bg-blue-50 rounded-xl p-4 text-center hover:bg-blue-100 transition-all">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-sm font-semibold text-blue-700">{item.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'explore' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Classrooms Explore Karo</h2>
              <Link to="/bookstore" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">📚 Book Store</Link>
            </div>
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="Class search karo..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" />
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400">
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🔍</div>
                <p>Koi classroom nahi mila.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filtered.map(cls => (
                  <div key={cls.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded">{cls.category}</span>
                      <span className="text-xs text-gray-500">{cls.mode}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{cls.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">👨‍🏫 {cls.users?.full_name}</p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{cls.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-orange-500">₹{cls.fee}</span>
                      <Link to={`/classroom/${cls.id}`} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">
                        Details देखो
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my classes' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">My Enrolled Classes</h2>
            {enrollments.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">📖</div>
                <p>Abhi koi class join nahi ki hai.</p>
                <button onClick={() => setActiveTab('explore')} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg">
                  Classes Explore Karo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map(enrollment => (
                  <div key={enrollment.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800">{enrollment.classrooms?.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{enrollment.classrooms?.category}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-orange-500 font-semibold">₹{enrollment.amount}</span>
                      <span className={`px-2 py-1 rounded text-xs ${enrollment.payment_status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {enrollment.payment_status === 'paid' ? '✅ Paid' : '⏳ Payment Pending'}
                      </span>
                    </div>
                    {enrollment.payment_status === 'paid' && enrollment.classrooms?.id && (
                      <div className="mt-3 space-y-2">
                        <button onClick={() => navigate(`/live/${enrollment.classrooms.id}`)}
                          className="w-full py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 font-semibold">
                          📹 Join Live Class
                        </button>
                        <button onClick={() => navigate(`/review/${enrollment.classrooms.id}`)}
                          className="w-full py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 font-semibold">
                          ⭐ Review Do
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my books' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">My Purchased Books</h2>
            {purchases.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">📚</div>
                <p>Abhi koi book purchase nahi ki hai.</p>
                <Link to="/bookstore" className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-lg">
                  Book Store Dekho
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {purchases.map(purchase => (
                  <div key={purchase.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-4xl mb-3">📖</div>
                    <h3 className="font-bold text-gray-800">{purchase.books?.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{purchase.books?.category}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-orange-500 font-semibold">₹{purchase.amount}</span>
                      <a href={purchase.books?.pdf_url} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">
                        📥 Download PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}