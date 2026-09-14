import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const STATES = ['Uttar Pradesh', 'Maharashtra', 'Delhi', 'Bihar', 'Rajasthan', 'Gujarat', 'Madhya Pradesh', 'Tamil Nadu', 'Karnataka', 'West Bengal', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Punjab', 'Haryana', 'Uttarakhand', 'Jharkhand', 'Chhattisgarh', 'Odisha', 'Assam']

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    mobile: '',
    password: '',
    state: '',
    city: '',
    account_type: 'student',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: dbError } = await supabase.from('users').insert({
        id: data.user.id,
        full_name: form.full_name,
        email: form.email,
        mobile: form.mobile,
        state: form.state,
        city: form.city,
        account_type: form.account_type,
        is_approved: form.account_type === 'student',
      })

      if (dbError) {
        setError(dbError.message)
        setLoading(false)
        return
      }

      if (form.account_type === 'teacher' || form.account_type === 'seller') {
        navigate('/login')
        alert('Registration successful! Admin approval ke baad login kar sakenge.')
      } else {
        navigate('/student/dashboard')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">🎓 SkillClass</h1>
          <p className="text-gray-500 mt-2">नया Account बनाएँ</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select name="account_type" value={form.account_type} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400">
              <option value="student">👨‍🎓 Student</option>
              <option value="teacher">👨‍🏫 Teacher</option>
              <option value="seller">🛍️ Book Seller</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Apna poora naam" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="10 digit mobile number" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="apna@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" required minLength={6} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" required>
                <option value="">Select State</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Apna shehar" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
            {loading ? 'Loading...' : 'Register करें'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already account hai?{' '}
          <Link to="/login" className="text-orange-500 font-semibold hover:underline">Login करें</Link>
        </p>
      </div>
    </div>
  )
}