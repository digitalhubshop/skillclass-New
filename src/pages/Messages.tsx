import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Messages() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('messages')
  const [messages, setMessages] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [classrooms, setClassrooms] = useState<any[]>([])
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<any[]>([])
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false)
  const [messageForm, setMessageForm] = useState({
    receiver_id: '',
    classroom_id: '',
    message: '',
  })
  const [announcementForm, setAnnouncementForm] = useState({
    classroom_id: '',
    title: '',
    message: '',
    type: 'announcement',
  })

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { navigate('/login'); return }
    const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    setUser(data)
    getMessages(authUser.id)
    getAnnouncements(authUser.id, data?.account_type)
    if (data?.account_type === 'teacher') getTeacherClassrooms(authUser.id)
    if (data?.account_type === 'student') getEnrolledClassrooms(authUser.id)
  }

  const getMessages = async (id: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:users!messages_sender_id_fkey(full_name, account_type), receiver:users!messages_receiver_id_fkey(full_name), classrooms(name)')
      .or(`sender_id.eq.${id},receiver_id.eq.${id}`)
      .order('created_at', { ascending: false })
    setMessages(data || [])
  }

  const getAnnouncements = async (id: string, type: string) => {
    if (type === 'teacher') {
      const { data } = await supabase
        .from('announcements')
        .select('*, classrooms(name)')
        .eq('teacher_id', id)
        .order('created_at', { ascending: false })
      setAnnouncements(data || [])
    } else {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('classroom_id')
        .eq('student_id', id)
      
      if (enrollments && enrollments.length > 0) {
        const classroomIds = enrollments.map((e: any) => e.classroom_id)
        const { data } = await supabase
          .from('announcements')
          .select('*, classrooms(name), users(full_name)')
          .in('classroom_id', classroomIds)
          .order('created_at', { ascending: false })
        setAnnouncements(data || [])
      }
    }
  }

  const getTeacherClassrooms = async (id: string) => {
    const { data } = await supabase.from('classrooms').select('*').eq('teacher_id', id).eq('is_approved', true)
    setClassrooms(data || [])
  }

  const getEnrolledClassrooms = async (id: string) => {
    const { data } = await supabase
      .from('enrollments')
      .select('*, classrooms(*, users(id, full_name))')
      .eq('student_id', id)
      .eq('payment_status', 'paid')
    setEnrolledClassrooms(data || [])
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from('messages').insert({
      sender_id: authUser?.id,
      receiver_id: messageForm.receiver_id,
      classroom_id: messageForm.classroom_id || null,
      message: messageForm.message,
    })
    setShowNewMessage(false)
    setMessageForm({ receiver_id: '', classroom_id: '', message: '' })
    getMessages(authUser?.id || '')
    alert('Message send ho gaya! ✅')
  }

  const postAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    await supabase.from('announcements').insert({
      teacher_id: authUser?.id,
      classroom_id: announcementForm.classroom_id,
      title: announcementForm.title,
      message: announcementForm.message,
      type: announcementForm.type,
    })
    setShowNewAnnouncement(false)
    setAnnouncementForm({ classroom_id: '', title: '', message: '', type: 'announcement' })
    getAnnouncements(authUser?.id || '', user?.account_type)
    alert('Announcement post ho gayi! ✅')
  }

  const getAnnouncementIcon = (type: string) => {
    if (type === 'cancel') return '❌'
    if (type === 'reschedule') return '🔄'
    return '📢'
  }

  const getAnnouncementColor = (type: string) => {
    if (type === 'cancel') return 'bg-red-50 border-red-200'
    if (type === 'reschedule') return 'bg-yellow-50 border-yellow-200'
    return 'bg-blue-50 border-blue-200'
  }

  const getDashboardLink = () => {
    if (user?.account_type === 'teacher') return '/teacher/dashboard'
    if (user?.account_type === 'seller') return '/seller/dashboard'
    if (user?.account_type === 'admin') return '/admin'
    return '/student/dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-orange-500">🎓 SkillClass</Link>
          <h2 className="text-lg font-semibold text-gray-700">💬 Messages & Announcements</h2>
          <Link to={getDashboardLink()} className="px-4 py-2 text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button onClick={() => setActiveTab('messages')}
            className={`pb-3 px-2 font-medium ${activeTab === 'messages' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}>
            💬 Messages ({messages.length})
          </button>
          <button onClick={() => setActiveTab('announcements')}
            className={`pb-3 px-2 font-medium ${activeTab === 'announcements' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}>
            📢 Announcements ({announcements.length})
          </button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Messages</h2>
              {user?.account_type === 'student' && (
                <button onClick={() => setShowNewMessage(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  + New Message
                </button>
              )}
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">💬</div>
                <p>Abhi koi message nahi hai।</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${msg.sender_id === user?.id ? 'border-orange-400' : 'border-blue-400'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold text-gray-800">
                          {msg.sender_id === user?.id ? '📤 Sent to: ' : '📥 From: '}
                          {msg.sender_id === user?.id ? msg.receiver?.full_name : msg.sender?.full_name}
                        </span>
                        {msg.classrooms && (
                          <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded">
                            {msg.classrooms?.name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString('hi-IN')}
                      </span>
                    </div>
                    <p className="text-gray-600">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Announcements</h2>
              {user?.account_type === 'teacher' && (
                <button onClick={() => setShowNewAnnouncement(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  + New Announcement
                </button>
              )}
            </div>

            {announcements.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">📢</div>
                <p>Abhi koi announcement nahi hai।</p>
                {user?.account_type === 'teacher' && (
                  <button onClick={() => setShowNewAnnouncement(true)}
                    className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg">
                    Pehla Announcement Karo
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map(ann => (
                  <div key={ann.id} className={`rounded-xl p-5 shadow-sm border ${getAnnouncementColor(ann.type)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getAnnouncementIcon(ann.type)}</span>
                        <div>
                          <h3 className="font-bold text-gray-800">{ann.title}</h3>
                          <span className="text-xs text-gray-500">
                            📚 {ann.classrooms?.name}
                            {ann.users && ` • 👨‍🏫 ${ann.users?.full_name}`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          ann.type === 'cancel' ? 'bg-red-100 text-red-600' :
                          ann.type === 'reschedule' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {ann.type === 'cancel' ? '❌ Class Cancel' :
                           ann.type === 'reschedule' ? '🔄 Reschedule' :
                           '📢 Announcement'}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(ann.created_at).toLocaleDateString('hi-IN')}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{ann.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Message Modal — Student only */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Teacher ko Message Bhejo</h2>
              <button onClick={() => setShowNewMessage(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={sendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Select Karo</label>
                <select required value={messageForm.classroom_id}
                  onChange={e => {
                    const cls = enrolledClassrooms.find((ec: any) => ec.classroom_id === e.target.value)
                    setMessageForm({...messageForm, classroom_id: e.target.value, receiver_id: cls?.classrooms?.users?.id || ''})
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg">
                  <option value="">Class Select Karo</option>
                  {enrolledClassrooms.map((ec: any) => (
                    <option key={ec.classroom_id} value={ec.classroom_id}>
                      {ec.classrooms?.name} — {ec.classrooms?.users?.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required value={messageForm.message}
                  onChange={e => setMessageForm({...messageForm, message: e.target.value})}
                  placeholder="Apna message likho... (chutti ki request, sawaal, etc.)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg" rows={4} />
              </div>
              <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600">
                📤 Message Bhejo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Announcement Modal — Teacher only */}
      {showNewAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Announcement</h2>
              <button onClick={() => setShowNewAnnouncement(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={postAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classroom Select Karo</label>
                <select required value={announcementForm.classroom_id}
                  onChange={e => setAnnouncementForm({...announcementForm, classroom_id: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg">
                  <option value="">Classroom Select Karo</option>
                  {classrooms.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Type</label>
                <select value={announcementForm.type}
                  onChange={e => setAnnouncementForm({...announcementForm, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg">
                  <option value="announcement">📢 General Announcement</option>
                  <option value="cancel">❌ Class Cancel (Chutti)</option>
                  <option value="reschedule">🔄 Class Reschedule</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" value={announcementForm.title}
                  onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})}
                  placeholder="e.g. Aaj ki class cancel hai"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required value={announcementForm.message}
                  onChange={e => setAnnouncementForm({...announcementForm, message: e.target.value})}
                  placeholder="Detail mein batao..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg" rows={4} />
              </div>
              <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600">
                📢 Announcement Post Karo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}