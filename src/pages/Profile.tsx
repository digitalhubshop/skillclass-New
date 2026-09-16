import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

const STATES = [
  'Uttar Pradesh', 'Maharashtra', 'Delhi', 'Bihar', 'Rajasthan', 'Gujarat',
  'Madhya Pradesh', 'Tamil Nadu', 'Karnataka', 'West Bengal', 'Andhra Pradesh',
  'Telangana', 'Kerala', 'Punjab', 'Haryana', 'Uttarakhand', 'Jharkhand',
  'Chhattisgarh', 'Odisha', 'Assam'
]

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    mobile: '',
    state: '',
    city: '',
    bio: '',
    experience: '',
  })

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { navigate('/login'); return }
    const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    setUser(data)
    setForm({
      full_name: data?.full_name || '',
      mobile: data?.mobile || '',
      state: data?.state || '',
      city: data?.city || '',
      bio: data?.bio || '',
      experience: data?.experience || '',
    })
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from('users').update({
      full_name: form.full_name,
      mobile: form.mobile,
      state: form.state,
      city: form.city,
      bio: form.bio,
      experience: form.experience,
    }).eq('id', authUser?.id)
    setSaving(false)
    alert('Profile update ho gayi! ✅')
  }

  const getDashboardLink = () => {
    if (user?.account_type === 'teacher') return '/teacher/dashboard'
    if (user?.account_type === 'seller') return '/seller/dashboard'
    if (user?.account_type === 'admin') return '/admin'
    return '/student/dashboard'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-orange-500 text-xl">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-orange-500">🎓 SkillClass</Link>
          <Link to={getDashboardLink()} className="px-4 py-2 text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
            {user?.account_type === 'teacher' ? '👨‍🏫' :
             user?.account_type === 'seller' ? '🛍️' :
             user?.account_type === 'admin' ? '👑' : '👨‍🎓'}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{user?.full_name}</h1>
          <p className="text-gray-500 mt-1">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm capitalize font-semibold">
            {user?.account_type}
          </span>
          <div className="flex justify-center gap-4 mt-3 text-sm text-gray-500">
            {user?.city && <span>📍 {user.city}</span>}
            {user?.state && <span>{user.state}</span>}
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">✏️ Profile Edit Karo</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={form.full_name}
                onChange={e => setForm({...form, full_name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input type="tel" value={form.mobile}
                onChange={e => setForm({...form, mobile: e.target.value})}
                placeholder="10 digit mobile number"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select value={form.state} onChange={e => setForm({...form, state: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400">
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={form.city}
                  onChange={e => setForm({...form, city: e.target.value})}
                  placeholder="Apna shehar"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea value={form.bio}
                onChange={e => setForm({...form, bio: e.target.value})}
                placeholder="Apne baare mein kuch likho..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                rows={3} />
            </div>

            {(user?.account_type === 'teacher' || user?.account_type === 'seller') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <textarea value={form.experience}
                  onChange={e => setForm({...form, experience: e.target.value})}
                  placeholder="Apna experience batao..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                  rows={2} />
              </div>
            )}

            <button type="submit" disabled={saving}
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
              {saving ? 'Saving...' : '✅ Profile Save Karo'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-800">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account Type</span>
              <span className="font-medium text-gray-800 capitalize">{user?.account_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={`font-medium ${user?.is_approved ? 'text-green-500' : 'text-yellow-500'}`}>
                {user?.is_approved ? '✅ Approved' : '⏳ Pending Approval'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Member Since</span>
              <span className="font-medium text-gray-800">
                {new Date(user?.created_at).toLocaleDateString('hi-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}