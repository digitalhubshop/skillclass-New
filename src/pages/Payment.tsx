import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Payment() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [transactionId, setTransactionId] = useState('')
  const [screenshot, setScreenshot] = useState('')
  const [notes, setNotes] = useState('')

  // Admin payment details — yahan apne details dalo
  const PAYMENT_DETAILS = {
    upi_ids: [
      { name: 'PhonePe / GPay / Paytm', id: 'skillclass@upi' },
      { name: 'Any UPI App', id: 'skillclass@okicici' },
    ],
    bank: {
      account_name: 'SkillClass',
      account_number: 'XXXXXXXXXXXX',
      ifsc: 'XXXXXXXXXX',
      bank_name: 'Bank Name',
      account_type: 'Current / Savings',
    }
  }

  useEffect(() => {
    getItem()
  }, [id, type])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate('/login'); return }

    await supabase.from('payments').insert({
      student_id: user.id,
      amount: item?.fee || item?.price,
      payment_method: paymentMethod,
      transaction_id: transactionId,
      screenshot_url: screenshot,
      notes: notes,
      status: 'pending',
    })

    setSubmitting(false)
    alert('Payment details submit ho gayi! Admin confirm karega aur aapki class/book activate ho jayegi.')
    navigate('/student/dashboard')
  }

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
          <h2 className="text-lg font-semibold text-gray-700">💳 Payment</h2>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Order Summary</h2>
          <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
            <div>
              <p className="font-semibold text-gray-800">{item?.name || item?.title}</p>
              <p className="text-sm text-gray-500">{type === 'classroom' ? `👨‍🏫 ${item?.users?.full_name}` : `✍️ ${item?.author}`}</p>
            </div>
            <div className="text-2xl font-bold text-orange-500">₹{item?.fee || item?.price}</div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💳 Payment Method Select Karo</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { value: 'upi', label: '📱 UPI', desc: 'GPay, PhonePe, Paytm' },
              { value: 'bank_transfer', label: '🏦 Bank Transfer', desc: 'NEFT / IMPS / RTGS' },
              { value: 'qr', label: '📲 QR Code', desc: 'Scan karke pay karo' },
            ].map(method => (
              <button
                key={method.value}
                onClick={() => setPaymentMethod(method.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${paymentMethod === method.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
              >
                <div className="text-xl mb-1">{method.label}</div>
                <div className="text-xs text-gray-500">{method.desc}</div>
              </button>
            ))}
          </div>

          {/* UPI Details */}
          {(paymentMethod === 'upi' || paymentMethod === 'qr') && (
            <div className="bg-blue-50 rounded-xl p-5 mb-4">
              <h3 className="font-bold text-blue-800 mb-3">📱 UPI se Payment Karo</h3>
              {PAYMENT_DETAILS.upi_ids.map((upi, i) => (
                <div key={i} className="flex justify-between items-center bg-white rounded-lg p-3 mb-2">
                  <div>
                    <p className="text-xs text-gray-500">{upi.name}</p>
                    <p className="font-bold text-gray-800">{upi.id}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(upi.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
              ))}
              <p className="text-xs text-blue-600 mt-2">⚠️ Payment karne ke baad Transaction ID zaroor note karo!</p>
            </div>
          )}

          {/* Bank Transfer Details */}
          {paymentMethod === 'bank_transfer' && (
            <div className="bg-green-50 rounded-xl p-5 mb-4">
              <h3 className="font-bold text-green-800 mb-3">🏦 Bank Transfer Details</h3>
              <div className="space-y-2">
                {[
                  { label: 'Account Name', value: PAYMENT_DETAILS.bank.account_name },
                  { label: 'Account Number', value: PAYMENT_DETAILS.bank.account_number },
                  { label: 'IFSC Code', value: PAYMENT_DETAILS.bank.ifsc },
                  { label: 'Bank Name', value: PAYMENT_DETAILS.bank.bank_name },
                  { label: 'Account Type', value: PAYMENT_DETAILS.bank.account_type },
                ].map(detail => (
                  <div key={detail.label} className="flex justify-between items-center bg-white rounded-lg p-3">
                    <div>
                      <p className="text-xs text-gray-500">{detail.label}</p>
                      <p className="font-bold text-gray-800">{detail.value}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(detail.value)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-600 mt-2">⚠️ Transfer karne ke baad UTR/Transaction ID zaroor note karo!</p>
            </div>
          )}
        </div>

        {/* Payment Confirmation Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">✅ Payment Confirm Karo</h2>
          <p className="text-sm text-gray-500 mb-4">Payment karne ke baad neeche details bharo — Admin verify karega aur aapki class/book activate ho jayegi।</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / UTR Number *</label>
              <input
                type="text"
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                placeholder="e.g. 123456789012"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Screenshot Link (Optional)</label>
              <input
                type="text"
                value={screenshot}
                onChange={e => setScreenshot(e.target.value)}
                placeholder="Google Drive link ya any image link"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
              />
              <p className="text-xs text-gray-400 mt-1">Screenshot Google Drive par upload karo aur link yahan paste karo</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Koi aur information..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : '✅ Payment Submit Karo'}
            </button>
          </form>

          <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
            <p className="text-sm text-yellow-700">
              ⏰ <strong>Note:</strong> Payment verify hone mein 2-24 ghante lag sakte hain। Admin verify karne ke baad tumhari class/book automatically activate ho jayegi।
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}