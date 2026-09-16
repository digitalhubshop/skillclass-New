import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://skillclass-new.onrender.com/reset-password',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">🎓 SkillClass</h1>
          <p className="text-gray-500 mt-2">Password Reset करें</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Email Bhej Di!</h2>
            <p className="text-gray-500 mb-6">
              <strong>{email}</strong> par password reset link bheja gaya hai।
              Email check karo aur link par click karo।
            </p>
            <Link to="/login" className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600">
              Login Par Wapas Jao
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="apna@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Bhej rahe hain...' : '📧 Reset Link Bhejo'}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              <Link to="/login" className="text-orange-500 font-semibold hover:underline">
                ← Login Par Wapas Jao
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}