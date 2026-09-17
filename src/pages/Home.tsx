import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalBooks: 0,
  })

  useEffect(() => {
    getStats()
  }, [])

  const getStats = async () => {
    const [cls, teachers, students, books] = await Promise.all([
      supabase.from('classrooms').select('id', { count: 'exact' }).eq('is_approved', true),
      supabase.from('users').select('id', { count: 'exact' }).eq('account_type', 'teacher'),
      supabase.from('users').select('id', { count: 'exact' }).eq('account_type', 'student'),
      supabase.from('books').select('id', { count: 'exact' }).eq('is_approved', true),
    ])
    setStats({
      totalClasses: cls.count || 0,
      totalTeachers: teachers.count || 0,
      totalStudents: students.count || 0,
      totalBooks: books.count || 0,
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/student/dashboard?search=${encodeURIComponent(search)}`)
    }
  }

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
            <Link to="/contact" className="hover:text-orange-500">Contact</Link>
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
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3 mb-10">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="आप क्या सीखना चाहते हैं? SSC, UPSC, Cooking..."
            className="flex-1 px-6 py-4 rounded-xl border border-gray-200 text-lg focus:outline-none focus:border-orange-400" />
          <button type="submit" className="px-8 py-4 bg-orange-500 text-white rounded-xl text-lg font-semibold hover:bg-orange-600">
            खोजें
          </button>
        </form>

        {/* Real Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { label: 'Live Classes', value: stats.totalClasses, icon: '🏫' },
            { label: 'Teachers', value: stats.totalTeachers, icon: '👨‍🏫' },
            { label: 'Students', value: stats.totalStudents, icon: '👨‍🎓' },
            { label: 'Books', value: stats.totalBooks, icon: '📚' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-2xl font-bold text-orange-500">{item.value}+</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { icon: '🏛️', name: 'SSC Preparation' },
            { icon: '🎖️', name: 'UPSC/IAS' },
            { icon: '🏦', name: 'Banking Exams' },
            { icon: '🚂', name: 'Railway RRB' },
            { icon: '🎓', name: 'TET/CTET' },
            { icon: '🚔', name: 'Police Exams' },
            { icon: '🏥', name: 'NEET' },
            { icon: '🔬', name: 'JEE/GATE' },
            { icon: '🪖', name: 'Defence/NDA' },
            { icon: '📊', name: 'State PCS' },
            { icon: '📚', name: 'Academic' },
            { icon: '💻', name: 'Computer & Tech' },
            { icon: '💄', name: 'Beauty & Makeup' },
            { icon: '👗', name: 'Silai & Fashion' },
            { icon: '📱', name: 'Digital Marketing' },
            { icon: '🍳', name: 'Cooking' },
            { icon: '🎨', name: 'Art & Craft' },
            { icon: '💼', name: 'Business' },
            { icon: '🗣️', name: 'Language' },
            { icon: '📸', name: 'Photography' },
          ].map((cat) => (
            <button key={cat.name}
              onClick={() => navigate(`/student/dashboard?category=${encodeURIComponent(cat.name)}`)}
              className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-gray-800 text-sm">{cat.name}</h3>
            </button>
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
          <button onClick={() => navigate('/student/dashboard?category=SSC Preparation')}
            className="px-8 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50">
            अभी Join करें
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-2xl font-bold text-orange-400 mb-2">🎓 SkillClass</p>
          <p className="text-gray-400">हर Skill का अपना Classroom</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link to="/terms" className="text-gray-400 hover:text-orange-400">Terms & Conditions</Link>
            <Link to="/contact" className="text-gray-400 hover:text-orange-400">Contact Us</Link>
            <Link to="/bookstore" className="text-gray-400 hover:text-orange-400">Book Store</Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">© 2026 SkillClass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}