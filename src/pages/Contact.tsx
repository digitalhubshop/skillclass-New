import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-orange-500">🎓 SkillClass</Link>
          <Link to="/" className="px-4 py-2 text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50">
            Home
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📞 Contact Us</h1>
          <p className="text-gray-500">Koi bhi sawaal ho — hum yahan hain!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: '📧', label: 'Email', value: 'support@skillclass.in' },
                  { icon: '🌐', label: 'Website', value: 'skillclass-new.onrender.com' },
                  { icon: '⏰', label: 'Support Hours', value: 'Mon-Sat: 9 AM - 6 PM' },
                  { icon: '🇮🇳', label: 'Location', value: 'India' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="font-medium text-gray-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">❓ Common Questions</h2>
              <div className="space-y-3">
                {[
                  { q: 'Teacher kaise banu?', a: 'Register karo → Teacher select karo → Admin approval ke baad classes bana sakte ho!' },
                  { q: 'Payment kaise karu?', a: 'UPI, Card, Net Banking sab accept hota hai — Razorpay se secure payment!' },
                  { q: 'Payout kab milega?', a: '1-3 business days mein UPI ya Bank Transfer se!' },
                  { q: 'Book kaise upload karu?', a: 'Seller account banao → Admin approve karega → Book upload karo!' },
                ].map(item => (
                  <div key={item.q} className="bg-white rounded-xl p-4">
                    <p className="font-semibold text-gray-800 text-sm">🙋 {item.q}</p>
                    <p className="text-gray-600 text-sm mt-1">✅ {item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">✉️ Message Bhejo</h2>

            {sent ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Message Send Ho Gaya!</h3>
                <p className="text-gray-500 mb-6">Hum 24 ghante mein reply karenge।</p>
                <button onClick={() => setSent(false)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600">
                  Nayi Message Bhejo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aapka Naam</label>
                  <input type="text" required value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="apna@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select required value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400">
                    <option value="">Subject Select Karo</option>
                    <option>Payment Issue</option>
                    <option>Teacher Registration</option>
                    <option>Seller Registration</option>
                    <option>Payout Query</option>
                    <option>Technical Problem</option>
                    <option>Book Upload Issue</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="Apni problem ya sawaal yahan likho..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                    rows={5} />
                </div>
                <button type="submit"
                  className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600">
                  ✉️ Message Bhejo
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl font-bold text-orange-400 mb-2">🎓 SkillClass</p>
          <p className="text-gray-400 text-sm">© 2026 SkillClass. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-3 text-sm">
            <Link to="/terms" className="text-gray-400 hover:text-orange-400">Terms & Conditions</Link>
            <Link to="/contact" className="text-gray-400 hover:text-orange-400">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}