import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function Payment() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadRazorpay()
    getUser()
    getItem()
  }, [id, type])

  const loadRazorpay = () => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
  }

  const getUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { navigate('/login'); return }
    const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    setUser(data)
  }

  const getItem = async () => {
    if (type === 'classroom') {
      const { data } = await supabase.from('classrooms').select('*, users(full_name)').eq('id', id).single()
      setItem(data)
    } else if (type === 'book') {
      const { data } = await supabase.from('books').select('*, users(full_name)').eq('id', id).single()
      setItem(data)
    }
    setLoading(false)
  }

  const handlePayment = async () => {
    if (!window.Razorpay) {
      alert('Payment system load ho raha hai, thoda wait karo!')
      return
    }

    setPaying(true)
    const amount = item?.fee || item?.price
    const platformCommission = type === 'classroom' ? amount * 0.10 : amount * 0.02
    const receiverAmount = amount - platformCommission

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: 'SkillClass',
      description: item?.name || item?.title,
      image: '/favicon.svg',
      handler: async (response: any) => {
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (type === 'classroom') {
          await supabase.from('enrollments').insert({
            student_id: authUser?.id,
            classroom_id: id,
            amount: amount,
            payment_status: 'paid',
          })

          const { data: existingWallet } = await supabase
            .from('wallets').select('*').eq('user_id', item.teacher_id).single()

          if (existingWallet) {
            await supabase.from('wallets').update({
              total_earned: (existingWallet.total_earned || 0) + receiverAmount,
              available_balance: (existingWallet.available_balance || 0) + receiverAmount,
            }).eq('user_id', item.teacher_id)
          } else {
            await supabase.from('wallets').insert({
              user_id: item.teacher_id,
              total_earned: receiverAmount,
              available_balance: receiverAmount,
            })
          }
        } else if (type === 'book') {
          const bookCommission = amount * 0.02
          const sellerAmount = amount - bookCommission

          await supabase.from('book_purchases').insert({
            student_id: authUser?.id,
            book_id: id,
            amount: amount,
            commission: bookCommission,
            seller_amount: sellerAmount,
          })

          const { data: existingWallet } = await supabase
            .from('wallets').select('*').eq('user_id', item.seller_id).single()

          if (existingWallet) {
            await supabase.from('wallets').update({
              total_earned: (existingWallet.total_earned || 0) + sellerAmount,
              available_balance: (existingWallet.available_balance || 0) + sellerAmount,
            }).eq('user_id', item.seller_id)
          } else {
            await supabase.from('wallets').insert({
              user_id: item.seller_id,
              total_earned: sellerAmount,
              available_balance: sellerAmount,
            })
          }
        }

        await supabase.from('payments').insert({
          student_id: authUser?.id,
          amount: amount,
          payment_method: 'razorpay',
          transaction_id: response.razorpay_payment_id,
          status: 'confirmed',
        })

        setPaying(false)
        alert('🎉 Payment Successful! Aapki class/book activate ho gayi!')
        navigate('/student/dashboard')
      },
      prefill: {
        name: user?.full_name || '',
        email: user?.email || '',
        contact: user?.mobile || '',
      },
      theme: {
        color: '#f97316',
      },
      modal: {
        ondismiss: () => {
          setPaying(false)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-orange-500 text-xl">Loading...</div>
    </div>
  )

  const amount = item?.fee || item?.price
  const platformCommission = type === 'classroom' ? amount * 0.10 : amount * 0.02
  const receiverAmount = amount - platformCommission

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-orange-500">🎓 SkillClass</Link>
          <h2 className="text-lg font-semibold text-gray-700">💳 Payment</h2>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Order Summary</h2>
          <div className="p-4 bg-orange-50 rounded-xl mb-4">
            <p className="font-bold text-gray-800 text-lg">{item?.name || item?.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              {type === 'classroom' ? `👨‍🏫 ${item?.users?.full_name}` : `✍️ ${item?.author}`}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold">₹{amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform Commission ({type === 'classroom' ? '10%' : '2%'})</span>
              <span className="font-semibold text-red-500">-₹{platformCommission}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{type === 'classroom' ? 'Teacher' : 'Seller'} ko milega</span>
              <span className="font-semibold text-green-500">₹{receiverAmount}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total Pay Karo</span>
              <span className="text-orange-500">₹{amount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💳 Payment Options</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { icon: '📱', label: 'UPI' },
              { icon: '💳', label: 'Card' },
              { icon: '🏦', label: 'Net Banking' },
            ].map(opt => (
              <div key={opt.label} className="p-3 bg-orange-50 rounded-xl text-center border border-orange-200">
                <div className="text-2xl mb-1">{opt.icon}</div>
                <p className="text-xs font-semibold text-orange-700">{opt.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">Razorpay secure payment — UPI, Card, Net Banking, Wallet sab accept hota hai</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full py-5 bg-orange-500 text-white rounded-2xl font-bold text-xl hover:bg-orange-600 disabled:opacity-50 shadow-lg"
        >
          {paying ? '⏳ Processing...' : `💳 ₹${amount} Pay Karo`}
        </button>

        <div className="mt-4 p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-green-700 text-center">
            🔒 100% Secure Payment — Powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  )
}