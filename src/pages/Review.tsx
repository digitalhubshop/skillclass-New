import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Review() {
  const { classroomId } = useParams()
  const navigate = useNavigate()
  const [classroom, setClassroom] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [form, setForm] = useState({
    rating: 5,
    teaching_quality: 5,
    content_quality: 5,
    communication: 5,
    review: '',
  })

  useEffect(() => {
    getClassroom()
    getReviews()
  }, [classroomId])

  const getClassroom = async () => {
    const { data } = await supabase.from('classrooms').select('*, users(full_name)').eq('id', classroomId).single()
    setClassroom(data)
    setLoading(false)
  }

  const getReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, users(full_name)')
      .eq('classroom_id', classroomId)
      .order('created_at', { ascending: false })
    setReviews(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate('/login'); return }

    await supabase.from('reviews').insert({
      student_id: user.id,
      classroom_id: classroomId,
      rating: form.rating,
      teaching_quality: form.teaching_quality,
      content_quality: form.content_quality,
      communication: form.communication,
      review: form.review,
    })

    setSubmitting(false)
    alert('Review submit ho gayi! Shukriya 😊')
    getReviews()
    setForm({ rating: 5, teaching_quality: 5, content_quality: 5, communication: 5, review: '' })
  }

  const StarRating = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)}
          className={`text-2xl ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </button>
      ))}
    </div>
  )

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-orange-500 text-xl">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-orange-500">🎓 SkillClass</Link>
          <Link to="/student/dashboard" className="px-4 py-2 text-orange-500 border border-orange-200 rounded-lg">Dashboard</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Classroom Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{classroom?.name}</h1>
          <p className="text-gray-500 mt-1">👨‍🏫 {classroom?.users?.full_name}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-3xl font-bold text-yellow-400">{avgRating}</span>
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.round(Number(avgRating)))}{'☆'.repeat(5 - Math.round(Number(avgRating)))}
            </div>
            <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">⭐ Apni Review Do</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
              <StarRating value={form.rating} onChange={v => setForm({...form, rating: v})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Quality</label>
              <StarRating value={form.teaching_quality} onChange={v => setForm({...form, teaching_quality: v})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Quality</label>
              <StarRating value={form.content_quality} onChange={v => setForm({...form, content_quality: v})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Communication</label>
              <StarRating value={form.communication} onChange={v => setForm({...form, communication: v})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                required
                placeholder="Apna experience share karo..."
                value={form.review}
                onChange={e => setForm({...form, review: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                rows={4}
              />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
              {submitting ? 'Submitting...' : '⭐ Review Submit Karo'}
            </button>
          </form>
        </div>

        {/* All Reviews */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">📝 Sab Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <div className="text-4xl mb-3">⭐</div>
              <p>Abhi koi review nahi hai. Pehli review do!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{review.users?.full_name}</p>
                      <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('hi-IN')}</p>
                    </div>
                    <div className="flex text-yellow-400 text-lg">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.review}</p>
                  <div className="flex gap-4 mt-3 text-xs text-gray-500">
                    <span>Teaching: {'★'.repeat(review.teaching_quality || 0)}</span>
                    <span>Content: {'★'.repeat(review.content_quality || 0)}</span>
                    <span>Communication: {'★'.repeat(review.communication || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}