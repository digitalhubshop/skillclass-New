import { Link } from 'react-router-dom'

export default function Invite() {
  const baseUrl = 'https://skillclass-new.onrender.com'

  const teacherLink = `${baseUrl}/register?type=teacher`
  const studentLink = `${baseUrl}/register?type=student`
  const sellerLink = `${baseUrl}/register?type=seller`

  const teacherWhatsApp = `https://wa.me/?text=${encodeURIComponent(`🎓 *SkillClass* पर Teacher बनें और घर बैठे कमाएं!

✅ अपनी Skill सिखाएं
✅ अपनी Fee खुद तय करें
✅ Live Classes लें
✅ Direct Wallet में पैसे पाएं

👉 अभी Register करें:
${teacherLink}

*SkillClass — हर Skill का अपना Classroom*`)}`

  const studentWhatsApp = `https://wa.me/?text=${encodeURIComponent(`🎓 *SkillClass* पर अपनी पसंद की Skill सीखें!

✅ SSC, UPSC, Banking, Railway की तैयारी
✅ Beauty, Cooking, Silai, Computer Classes
✅ Expert Teachers से सीखें
✅ Live Classes

👉 अभी Register करें:
${studentLink}

*SkillClass — हर Skill का अपना Classroom*`)}`

  const sellerWhatsApp = `https://wa.me/?text=${encodeURIComponent(`📚 *SkillClass* पर अपनी PDF Books बेचें!

✅ अपनी Books Upload करें
✅ Direct Wallet में पैसे पाएं
✅ All India Students तक पहुंचें
✅ 98% Earnings आपकी

👉 अभी Register करें:
${sellerLink}

*SkillClass — हर Skill का अपना Classroom*`)}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Link copy ho gayi! ✅')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-orange-500">🎓 SkillClass</Link>
          <Link to="/admin" className="px-4 py-2 text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50">
            Admin Panel
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📨 Invite System</h1>
          <p className="text-gray-500">Teachers, Students aur Sellers ko invite karo WhatsApp par!</p>
        </div>

        {/* Teacher Invite */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">👨‍🏫</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Teacher Invite</h2>
              <p className="text-gray-500 text-sm">Teachers ko invite karo classes banane ke liye</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Teacher Registration Link:</p>
            <p className="text-sm font-mono text-orange-600 break-all">{teacherLink}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => copyToClipboard(teacherLink)}
              className="flex-1 py-3 bg-orange-100 text-orange-600 rounded-xl font-semibold hover:bg-orange-200">
              📋 Link Copy Karo
            </button>
            <a href={teacherWhatsApp} target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 text-center">
              📱 WhatsApp Par Share Karo
            </a>
          </div>
        </div>

        {/* Student Invite */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">👨‍🎓</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Student Invite</h2>
              <p className="text-gray-500 text-sm">Students ko invite karo classes join karne ke liye</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Student Registration Link:</p>
            <p className="text-sm font-mono text-blue-600 break-all">{studentLink}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => copyToClipboard(studentLink)}
              className="flex-1 py-3 bg-blue-100 text-blue-600 rounded-xl font-semibold hover:bg-blue-200">
              📋 Link Copy Karo
            </button>
            <a href={studentWhatsApp} target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 text-center">
              📱 WhatsApp Par Share Karo
            </a>
          </div>
        </div>

        {/* Seller Invite */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🛍️</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Book Seller Invite</h2>
              <p className="text-gray-500 text-sm">Sellers ko invite karo books upload karne ke liye</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Seller Registration Link:</p>
            <p className="text-sm font-mono text-purple-600 break-all">{sellerLink}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => copyToClipboard(sellerLink)}
              className="flex-1 py-3 bg-purple-100 text-purple-600 rounded-xl font-semibold hover:bg-purple-200">
              📋 Link Copy Karo
            </button>
            <a href={sellerWhatsApp} target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 text-center">
              📱 WhatsApp Par Share Karo
            </a>
          </div>
        </div>

        {/* Platform Link */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">🌐 Platform Link</h2>
          <p className="text-orange-100 mb-4">Yeh link share karo sabke saath!</p>
          <p className="font-mono text-lg bg-white bg-opacity-20 rounded-xl px-4 py-2 mb-4">
            {baseUrl}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => copyToClipboard(baseUrl)}
              className="px-6 py-3 bg-white text-orange-500 rounded-xl font-semibold hover:bg-orange-50">
              📋 Copy Karo
            </button>
            <a href={`https://wa.me/?text=${encodeURIComponent(`🎓 SkillClass — हर Skill का अपना Classroom!\n\nIndia ka best online learning platform.\n\n👉 ${baseUrl}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600">
              📱 WhatsApp Share
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}