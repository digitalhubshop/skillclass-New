import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function LiveClass() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [classroom, setClassroom] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { navigate('/login'); return }
    const { data: userData } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    setUser(userData)
    getClassroom()
  }

  const getClassroom = async () => {
    const { data } = await supabase.from('classrooms').select('*, users(full_name)').eq('id', id).single()
    setClassroom(data)
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-orange-500 text-xl">Loading...</div>
    </div>
  )

  const roomName = `skillclass-${id}`
  const displayName = user?.full_name || 'Student'
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${displayName}"&config.startWithAudioMuted=false&config.startWithVideoMuted=false`

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-orange-400">🎓 {classroom?.name}</h1>
          <p className="text-sm text-gray-400">Live Class • {classroom?.users?.full_name}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          ❌ Class Chodo
        </button>
      </header>

      {/* Jitsi Meet */}
      <div className="flex-1">
        <iframe
          src={jitsiUrl}
          style={{ width: '100%', height: '100%', minHeight: '80vh', border: 'none' }}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          title="Live Class"
        />
      </div>
    </div>
  )
}