import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function ClassroomDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [classroom, setClassroom] = useState<any>(null)
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    getClassroom()
  }, [id])

  const getClassroom = async () => {
    const { data } = await supabase
      .from('classrooms')
      .select('*, users(*)')
      .eq('id', id)
      .single()
    setClassroom(data)
    setTeacher(data?.users)
    setLoading(false)
  }

  const handleEnroll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate('/login'); return }

    setEnrolling(true)
    await supabase.from('enrollments').insert({
      student_id: user.id,
      classroom_id: id,
      amount: classroom.fee,
      payment_status: 'pending',
    })
    setEnrolling(false)
    alert('Enrollment successful! Payment pending hai.')
    navigate('/student/dashboard')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-orange-500 text-xl">Loading...</div>
    </div>
  )

  if (!classroom) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Classroom nahi mila!</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-orange-500">🎓 SkillClass</Link>
          <Link to="/student/dashboard" className="px-4 py-2 text-orange-500 border border-orange-200 rounded-lg">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-8 text-white">
            <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm mb-4 inline-block">
              {classroom.category}
            </span>
            <h1 className="text-3xl font-bold mb-2">{classroom.name}</h1>
            <p className="text-orange-100">{classroom.mode === 'online' ? '🌐 Online' : '📍 Offline'} • {classroom.language}</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2">
                {/* Teacher Info */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-orange-50 rounded-xl">
                  <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-2xl">
                    👨‍🏫
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{teacher?.full_name}</p>
                    <p className="text-sm text-gray-500">{teacher?.city}, {teacher?.state}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">Class Description</h2>
                  <p className="text-gray-600">{classroom.description}</p>
                </div>

                {/* What you'll learn */}
                {classroom.what_will_learn && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">✅ Aap Kya Seekhenge?</h2>
                    <p className="text-gray-600">{classroom.what_will_learn}</p>
                  </div>
                )}

                {/* Schedule */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">📅 Schedule</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-800">{classroom.duration}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Class Days</p>
                      <p className="font-semibold text-gray-800">{classroom.class_days}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="font-semibold text-gray-800">{classroom.start_date}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Start Time</p>
                      <p className="font-semibold text-gray-800">{classroom.start_time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-orange-50 rounded-xl p-6 sticky top-6">
                  <div className="text-4xl font-bold text-orange-500 mb-2">₹{classroom.fee}</div>
                  <div className="space-y-3 mb-6 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>👥 Total Seats</span>
                      <span className="font-semibold">{classroom.seats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🌐 Mode</span>
                      <span className="font-semibold capitalize">{classroom.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🗣️ Language</span>
                      <span className="font-semibold">{classroom.language}</span>
                    </div>
                    {classroom.city && (
                      <div className="flex justify-between">
                        <span>📍 Location</span>
                        <span className="font-semibold">{classroom.city}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    {enrolling ? 'Processing...' : '🎓 Enroll Now'}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    Enrollment ke baad payment confirm hogi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}