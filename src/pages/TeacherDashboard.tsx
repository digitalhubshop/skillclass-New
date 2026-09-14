import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [classrooms, setClassrooms] = useState<any[]>([])
  const [wallet, setWallet] = useState<any>(null)
  const [showCreateClass, setShowCreateClass] = useState(false)
  const [form, setForm] = useState({
    name: '', category: '', description: '', what_will_learn: '',
    duration: '', class_days: '', start_date: '', start_time: '',
    seats: '', fee: '', language: 'Hindi', state: '', city: '', mode: 'online'
  })

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { navigate('/login'); return }

    const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    setUser(data)
    getClassrooms(authUser.id)
    getWallet(authUser.id)
  }

  const getClassrooms = async (id: string) => {
    const { data } = await supabase.from('classrooms').select('*').eq('teacher_id', id)
    setClassrooms(data || [])
  }

  const getWallet = async (id: string) => {
    const { data } = await supabase.from('wallets').select('*').eq('user_id', id).single()
    setWallet(data)
  }

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from('classrooms').insert({ ...form, teacher_id: authUser?.id, seats: parseInt(form.seats), fee: parseFloat(form.fee) })
    setShowCreateClass(false)
    getClassrooms(authUser?.id || '')
    alert('Classroom created! Admin approval pending.')
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
          <h1 className="text-xl font-bold text-orange-500">🎓 SkillClass — Teacher Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">👋 {user?.full_name}</span>
            <button onClick={handleLogout} className="px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {['overview', 'classrooms', 'earnings', 'payout'].map(tab => (
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
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Classes', value: classrooms.length, icon: '🏫' },
                { label: 'Active Classes', value: classrooms.filter(c => c.is_active).length, icon: '✅' },
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
          </div>
        )}

        {/* Classrooms */}
        {activeTab === 'classrooms' && (
          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">My Classrooms</h2>
              <button
                onClick={() => setShowCreateClass(true)}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                + Create Classroom
              </button>
            </div>

            {classrooms.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🏫</div>
                <p>Abhi koi classroom nahi hai. Pehla classroom banao!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classrooms.map(cls => (
                  <div key={cls.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800">{cls.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${cls.is_approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {cls.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{cls.category}</p>
                    <div className="flex gap-4 mt-4 text-sm text-gray-600">
                      <span>💰 ₹{cls.fee}</span>
                      <span>👥 {cls.seats} seats</span>
                      <span>📍 {cls.mode}</span>
                    </div>
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

      {/* Create Classroom Modal */}
      {showCreateClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Classroom Banao</h2>
              <button onClick={() => setShowCreateClass(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <input required placeholder="Classroom Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
                <option value="">Category Select Karo</option>
                {['Academic', 'Computer & Tech', 'Beauty & Makeup', 'Silai & Fashion', 'Digital Marketing', 'Cooking', 'Art & Craft', 'Business', 'Language', 'Photography'].map(c => <option key={c}>{c}</option>)}
              </select>
              <textarea required placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 border rounded-lg" rows={3} />
              <textarea required placeholder="Students Kya Seekhenge?" value={form.what_will_learn} onChange={e => setForm({...form, what_will_learn: e.target.value})} className="w-full px-4 py-3 border rounded-lg" rows={2} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Duration (e.g. 3 months)" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                <input required placeholder="Class Days (e.g. Mon, Wed)" value={form.class_days} onChange={e => setForm({...form, class_days: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                <input required type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Total Seats" value={form.seats} onChange={e => setForm({...form, seats: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                <input required type="number" placeholder="Fee (₹)" value={form.fee} onChange={e => setForm({...form, fee: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select value={form.language} onChange={e => setForm({...form, language: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
                  <option>Hindi</option>
                  <option>English</option>
                  <option>Hindi + English</option>
                </select>
                <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
                <input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              </div>
              <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600">
                Classroom Create Karo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}