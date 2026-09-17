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
  const [classrooms, setClassrooms] = useState<any[]>([])

  useEffect(() => {
    getStats()
    getFeaturedClassrooms()
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

  const getFeaturedClassrooms = async () => {
    const { data } = await supabase
      .from('classrooms')
      .select('*, users(full_name)')
      .eq('is_approved', true)
      .limit(4)
    setClassrooms(data || [])
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/student/dashboard?search=${encodeURIComponent(search)}`)
    }
  }

  const categories = [
    { icon: '🏛️', name: 'SSC Preparation' },
    { icon: '🎖️', name: 'UPSC/IAS' },
    { icon: '🍳', name: 'Cooking' },
    { icon: '💄', name: 'Beauty & Makeup' },
    { icon: '👗', name: 'Silai & Fashion' },
    { icon: '💼', name: 'Business' },
    { icon: '💎', name: 'Jewelry Making' },
    { icon: '💻', name: 'Computer & Tech' },
  ]

  const testimonials = [
    { name: 'Priya Singh', role: 'Student', text: 'SkillClass ne meri life change kar di! Cooking seekhi aur ab ghar se orders aa rahe hain!', stars: 5 },
    { name: 'Amit Kumar', role: 'Teacher', text: 'Main teacher hun aur SkillClass se bahut achha earn kar raha hun. Platform bahut simple hai!', stars: 5 },
    { name: 'Neha Verma', role: 'Student', text: 'SSC ki taiyari SkillClass se ki aur exam mein pass ho gayi! Best platform hai!', stars: 5 },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎓</span>
            <div>
              <span className="text-xl font-bold text-blue-600">SkillClass</span>
              <p className="text-xs text-gray-400 leading-none">Learn • Teach • Grow</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-blue-600 font-semibold text-blue-600">Home</Link>
            <Link to="/student/dashboard" className="hover:text-blue-600">Courses</Link>
            <Link to="/student/dashboard" className="hover:text-blue-600">Teachers</Link>
            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          </nav>
          <div className="flex gap-3 items-center">
            <button className="hidden md:block text-gray-500 hover:text-blue-600">🔍</button>
            <Link to="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-600 font-semibold text-sm mb-2 uppercase tracking-wide">🇮🇳 India's Leading Skill Learning Platform</p>
              <h1 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
                Har Skill Ka Apna <span className="text-blue-600">Classroom</span>
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                SkillClass ek online learning platform hai jahan students, teachers aur skill experts ek hi jagah par connect karte hain। Seekhein, sikhayen aur apne future ko behtar banayen।
              </p>
              <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search for courses, teachers, or skills..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-gray-700"
                />
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                  Search
                </button>
              </form>
              <div className="flex gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-xl">📹</span>
                  <span>Live Classes<br/>& Recordings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-xl">🔒</span>
                  <span>Safe & Secure<br/>Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-xl">👨‍🏫</span>
                  <span>Learn from<br/>Expert Teachers</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-8xl mb-4">👩‍💻</div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { label: 'Live Classes', value: `${stats.totalClasses}+`, icon: '🏫' },
                    { label: 'Teachers', value: `${stats.totalTeachers}+`, icon: '👨‍🏫' },
                    { label: 'Students', value: `${stats.totalStudents}+`, icon: '👨‍🎓' },
                    { label: 'Books', value: `${stats.totalBooks}+`, icon: '📚' },
                  ].map(item => (
                    <div key={item.label} className="bg-blue-50 rounded-xl p-3 text-center">
                      <div className="text-2xl">{item.icon}</div>
                      <div className="text-xl font-bold text-blue-600">{item.value}</div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Explore Our Popular Categories</h2>
              <p className="text-gray-500 mt-1">Find the right skill for your passion and career.</p>
            </div>
            <button onClick={() => navigate('/student/dashboard')} className="text-blue-600 font-semibold hover:underline hidden md:block">
              View All Courses →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => navigate(`/student/dashboard?category=${encodeURIComponent(cat.name)}`)}
                className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="text-xs font-semibold text-gray-700">{cat.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Courses</h2>
          <p className="text-gray-500 mb-8">Start learning from the best. Handpicked courses for your growth.</p>
          {classrooms.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <div className="text-5xl mb-4">🏫</div>
              <p>Jald hi classes available hongi!</p>
              <button onClick={() => navigate('/register?type=teacher')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Pehle Teacher Bano
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {classrooms.map(cls => (
                <div key={cls.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-6xl">
                    🎓
                  </div>
                  <div className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-semibold">{cls.category}</span>
                    <h3 className="font-bold text-gray-800 mt-2 mb-1 line-clamp-2">{cls.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">👨‍🏫 {cls.users?.full_name}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="text-xs text-gray-500">(New)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">₹{cls.fee}</span>
                      <button onClick={() => navigate(`/classroom/${cls.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-semibold">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Become a Teacher Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <p className="text-blue-200 font-semibold mb-2">READY TO LEARN?</p>
              <h2 className="text-4xl font-bold mb-4">Turn Your Knowledge Into Income</h2>
              <p className="text-blue-100 mb-6">Join SkillClass and start your journey as a learner or teacher। Build your skills, grow your career and achieve your dreams।</p>
              <button onClick={() => navigate('/register?type=teacher')}
                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50">
                Become a Teacher →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '📅', text: 'Set Your Classes' },
                { icon: '👥', text: 'Reach Students' },
                { icon: '💰', text: 'Earn Online' },
              ].map(item => (
                <div key={item.text} className="bg-white bg-opacity-20 rounded-xl p-4 text-center text-white">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-sm font-semibold">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SkillClass */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Why Choose SkillClass?</h2>
          <p className="text-center text-gray-500 mb-10">Because your skills deserve the right platform.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '⏰', title: 'Flexible Learning', desc: 'Learn at your own pace, anytime, anywhere.' },
              { icon: '👨‍🏫', title: 'Expert Instructors', desc: 'Learn from experienced and verified teachers.' },
              { icon: '🎯', title: 'Wide Range of Skills', desc: 'From traditional to digital, we have it all.' },
              { icon: '🤝', title: 'Community Support', desc: 'Be a part of a growing learning community.' },
            ].map(item => (
              <div key={item.title} className="text-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">What Our Learners Say</h2>
          <p className="text-center text-gray-500 mb-10">Real stories. Real growth.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-gray-600 mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                    {i === 0 ? '👩' : i === 1 ? '👨' : '👩'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                  <div className="ml-auto text-yellow-400">
                    {'★'.repeat(t.stars)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🎓</span>
                <div>
                  <p className="text-xl font-bold text-white">SkillClass</p>
                  <p className="text-xs text-gray-400">Learn • Teach • Grow</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">India ka sabse bada Skill Learning Platform। Seekhein, sikhayen aur aage badhein।</p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Quick Links</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p><Link to="/" className="hover:text-white">Home</Link></p>
                <p><Link to="/student/dashboard" className="hover:text-white">Courses</Link></p>
                <p><Link to="/register?type=teacher" className="hover:text-white">Teachers</Link></p>
                <p><Link to="/contact" className="hover:text-white">Contact</Link></p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Contact Us</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>📧 support@skillclass.in</p>
                <p>🌐 skillclass-new.onrender.com</p>
                <p>📍 India</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Follow Us</h3>
              <div className="flex gap-3 text-2xl">
                <span className="cursor-pointer hover:text-blue-400">📘</span>
                <span className="cursor-pointer hover:text-pink-400">📸</span>
                <span className="cursor-pointer hover:text-red-400">▶️</span>
                <span className="cursor-pointer hover:text-blue-300">💼</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex justify-between items-center text-sm text-gray-400">
            <p>© 2026 SkillClass. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/terms" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}