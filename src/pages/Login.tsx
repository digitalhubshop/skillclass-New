import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: userData } = await supabase
      .from('users')
      .select('account_type')
      .eq('id', data.user.id)
      .single()

    if (userData?.account_type === 'teacher') navigate('/teacher/dashboard')
    else if (userData?.account_type === 'admin') navigate('/admin')
    else if (userData?.account_type === 'seller') navigate('/seller/dashboard')
    else navigate('/student/dashboard')

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">🎓 SkillClass</h1>
          <p className="text-gray-500 mt-2">Login करें</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="apna@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
              required
            />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-orange-500 hover:underline">
              Password bhool gaye? 🔑
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login करें'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Account नहीं है?{' '}
          <Link to="/register" className="text-orange-500 font-semibold hover:underline">
            Register करें
          </Link>
        </p>
      </div>
    </div>
  )
}