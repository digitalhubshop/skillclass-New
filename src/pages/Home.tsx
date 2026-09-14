import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-500">🎓 SkillClass</span>
            <span className="text-xs text-gray-500 hidden md:block">हर Skill का अपना Classroom</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <Link to="/bookstore" className="hover:text-orange-500">Book Store</Link>
            <Link to="/register?type=teacher" className="hover:text-orange-500">Become a Teacher</Link>
            <Link to="/register?type=seller" className="hover:text-orange-500">Become a Seller</Link>
          </nav>
          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Register</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          हर Skill का अपना <span className="text-orange-500">Classroom</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">सीखें • सिखाएँ • बेचें • कमाएँ</p>
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            placeholder="आप क्या सीखना चाहते हैं?"
            className="flex-1 px-6 py-4 rounded-xl border border-gray-200 text-lg focus:outline-none focus:border-orange-400"
          />
          <button className="px-8 py-4 bg-orange-500 text-white rounded-xl text-lg font-semibold hover:bg-orange-600">
            खोजें
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { icon: '🏛️', name: 'SSC Preparation', count: '200+ Classes' },
            { icon: '🎖️', name: 'UPSC/IAS', count: '150+ Classes' },
            { icon: '🏦', name: 'Banking Exams', count: '180+ Classes' },
            { icon: '🚂', name: 'Railway RRB', count: '120+ Classes' },
            { icon: '🎓', name: 'TET/CTET', count: '90+ Classes' },
            { icon: '🚔', name: 'Police Exams', count: '110+ Classes' },
            { icon: '🏥', name: 'NEET', count: '95+ Classes' },
            { icon: '🔬', name: 'JEE/GATE', count: '85+ Classes' },
            { icon: '🪖', name: 'Defence/NDA', count: '70+ Classes' },
            { icon: '📊', name: 'State PCS', count: '130+ Classes' },
            { icon: '📚', name: 'Academic', count: '120+ Classes' },
            { icon: '💻', name: 'Computer & Tech', count: '85+ Classes' },
            { icon: '💄', name: 'Beauty & Makeup', count: '60+ Classes' },
            { icon: '👗', name: 'Silai & Fashion', count: '45+ Classes' },
            { icon: '📱', name: 'Digital Marketing', count: '70+ Classes' },
            { icon: '🍳', name: 'Cooking', count: '55+ Classes' },
            { icon: '🎨', name: 'Art & Craft', count: '40+ Classes' },
            { icon: '💼', name: 'Business', count: '65+ Classes' },
            { icon: '🗣️', name: 'Language', count: '50+ Classes' },
            { icon: '📸', name: 'Photography', count: '35+ Classes' },
          ].map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-gray-800 text-sm">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">SkillClass कैसे काम करता है?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '👨‍🎓', title: 'LEARN', desc: 'Student Skills सीखे' },
              { icon: '👨‍🏫', title: 'TEACH', desc: 'Teacher अपनी Skill सिखाए' },
              { icon: '🛍️', title: 'SELL', desc: 'Seller Digital Books बेचे' },
              { icon: '💰', title: 'EARN', desc: 'Teacher और Seller कमाएँ' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-orange-500 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Exam Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">🏛️ Government Exam Preparation</h2>
          <p className="text-blue-100 mb-6">SSC, UPSC, Banking, Railway, Police, TET — सभी Exams की तैयारी एक जगह!</p>
          <Link to="/register" className="px-8 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50">
            अभी Join करें
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-2xl font-bold text-orange-400 mb-2">🎓 SkillClass</p>
          <p className="text-gray-400">हर Skill का अपना Classroom</p>
          <p className="text-gray-500 text-sm mt-4">© 2026 SkillClass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}