import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function AdminPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<any[]>([])
  const [classrooms, setClassrooms] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [payouts, setPayouts] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [adminWallet, setAdminWallet] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0, totalTeachers: 0, totalStudents: 0, totalSellers: 0,
    totalClassrooms: 0, totalBooks: 0, pendingPayouts: 0, totalPayments: 0
  })

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate('/login'); return }
    const { data } = await supabase.from('users').select('account_type').eq('id', user.id).single()
    if (data?.account_type !== 'admin') { navigate('/'); return }
    loadData()
  }

  const loadData = async () => {
    const [usersRes, classroomsRes, booksRes, payoutsRes, paymentsRes, adminWalletRes] = await Promise.all([
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('classrooms').select('*, users(full_name)').order('created_at', { ascending: false }),
      supabase.from('books').select('*, users(full_name)').order('created_at', { ascending: false }),
      supabase.from('payout_requests').select('*, users(full_name, account_type)').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_wallet').select('*').single(),
    ])

    setUsers(usersRes.data || [])
    setClassrooms(classroomsRes.data || [])
    setBooks(booksRes.data || [])
    setPayouts(payoutsRes.data || [])
    setPayments(paymentsRes.data || [])
    setAdminWallet(adminWalletRes.data)

    const u = usersRes.data || []
    setStats({
      totalUsers: u.length,
      totalTeachers: u.filter((x: any) => x.account_type === 'teacher').length,
      totalStudents: u.filter((x: any) => x.account_type === 'student').length,
      totalSellers: u.filter((x: any) => x.account_type === 'seller').length,
      totalClassrooms: classroomsRes.data?.length || 0,
      totalBooks: booksRes.data?.length || 0,
      pendingPayouts: payoutsRes.data?.filter((x: any) => x.status === 'pending').length || 0,
      totalPayments: paymentsRes.data?.length || 0,
    })
  }

  const approveUser = async (id: string) => {
    await supabase.from('users').update({ is_approved: true }).eq('id', id)
    loadData()
  }

  const blockUser = async (id: string, blocked: boolean) => {
    await supabase.from('users').update({ is_blocked: !blocked }).eq('id', id)
    loadData()
  }

  const approveClassroom = async (id: string) => {
    await supabase.from('classrooms').update({ is_approved: true }).eq('id', id)
    loadData()
  }

  const approveBook = async (id: string) => {
    await supabase.from('books').update({ is_approved: true }).eq('id', id)
    loadData()
  }

  const updatePayout = async (id: string, status: string, userId: string, amount: number) => {
    await supabase.from('payout_requests').update({ status }).eq('id', id)

    if (status === 'paid') {
      const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', userId).single()
      if (wallet) {
        await supabase.from('wallets').update({
          available_balance: (wallet.available_balance || 0) - amount,
          total_withdrawn: (wallet.total_withdrawn || 0) + amount,
        }).eq('user_id', userId)
      }

      await supabase.from('admin_wallet').update({
        total_withdrawn: (adminWallet?.total_withdrawn || 0) + amount,
      }).eq('id', adminWallet?.id)
    }

    loadData()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-400">👑 SkillClass Admin Panel</h1>
          <button onClick={handleLogout} className="px-4 py-2 text-red-400 border border-red-400 rounded-lg hover:bg-red-900">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 border-b overflow-x-auto">
          {['overview', 'users', 'classrooms', 'books', 'payments', 'payouts', 'wallet'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
                { label: 'Teachers', value: stats.totalTeachers, icon: '👨‍🏫' },
                { label: 'Students', value: stats.totalStudents, icon: '👨‍🎓' },
                { label: 'Sellers', value: stats.totalSellers, icon: '🛍️' },
                { label: 'Classrooms', value: stats.totalClassrooms, icon: '🏫' },
                { label: 'Books', value: stats.totalBooks, icon: '📚' },
                { label: 'Pending Payouts', value: stats.pendingPayouts, icon: '💸' },
                { label: 'Total Payments', value: stats.totalPayments, icon: '💳' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-bold text-gray-800">{item.value}</div>
                  <div className="text-sm text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Admin Wallet Quick View */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-bold mb-4">👑 Admin Wallet</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: adminWallet?.total_revenue || 0 },
                  { label: 'Class Commission', value: adminWallet?.classroom_commission || 0 },
                  { label: 'Book Commission', value: adminWallet?.book_commission || 0 },
                  { label: 'Available Balance', value: adminWallet?.available_balance || 0 },
                ].map(item => (
                  <div key={item.label} className="bg-white bg-opacity-20 rounded-xl p-4">
                    <div className="text-2xl font-bold">₹{item.value}</div>
                    <div className="text-sm text-orange-100">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Users ({users.length})</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">State</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.mobile}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded capitalize">{user.account_type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.state}<br/>{user.city}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${user.is_approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {user.is_approved ? '✅ Approved' : '⏳ Pending'}
                        </span>
                        {user.is_blocked && <span className="ml-1 px-2 py-1 bg-red-100 text-red-600 rounded text-xs">🚫 Blocked</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!user.is_approved && (
                            <button onClick={() => approveUser(user.id)} className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                              Approve
                            </button>
                          )}
                          <button onClick={() => blockUser(user.id, user.is_blocked)}
                            className={`px-3 py-1 rounded text-xs text-white ${user.is_blocked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}>
                            {user.is_blocked ? 'Unblock' : 'Block'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Classrooms */}
        {activeTab === 'classrooms' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Classrooms ({classrooms.length})</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Classroom</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Teacher</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Fee</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {classrooms.map(cls => (
                    <tr key={cls.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{cls.name}</div>
                        <div className="text-sm text-gray-500">{cls.category} • {cls.mode}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{cls.users?.full_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-orange-500">₹{cls.fee}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${cls.is_approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {cls.is_approved ? '✅ Approved' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!cls.is_approved && (
                          <button onClick={() => approveClassroom(cls.id)} className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Books */}
        {activeTab === 'books' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Books ({books.length})</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Book</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Seller</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {books.map(book => (
                    <tr key={book.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{book.title}</div>
                        <div className="text-sm text-gray-500">{book.category} • {book.language}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{book.users?.full_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-orange-500">₹{book.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${book.is_approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {book.is_approved ? '✅ Approved' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!book.is_approved && (
                          <button onClick={() => approveBook(book.id)} className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments */}
        {activeTab === 'payments' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Payments ({payments.length})</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Method</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{payment.transaction_id || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-orange-500">₹{payment.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 uppercase">{payment.payment_method}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${payment.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {payment.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(payment.created_at).toLocaleDateString('hi-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payouts */}
        {activeTab === 'payouts' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payout Requests ({payouts.length})</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">User</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Method & Details</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payouts.map(payout => (
                    <tr key={payout.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{payout.users?.full_name}</div>
                        <div className="text-xs text-gray-500 capitalize">{payout.users?.account_type}</div>
                        <div className="text-xs text-gray-400">{new Date(payout.created_at).toLocaleDateString('hi-IN')}</div>
                      </td>
                      <td className="px-6 py-4 text-orange-500 font-bold text-lg">₹{payout.amount}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-700 uppercase">{payout.method}</div>
                        {payout.upi_id && <div className="text-sm text-gray-600">UPI: {payout.upi_id}</div>}
                        {payout.bank_account && <div className="text-sm text-gray-600">Acc: {payout.bank_account}</div>}
                        {payout.ifsc && <div className="text-sm text-gray-600">IFSC: {payout.ifsc}</div>}
                        {payout.bank_name && <div className="text-sm text-gray-600">Bank: {payout.bank_name}</div>}
                        {payout.account_holder && <div className="text-sm text-gray-600">Name: {payout.account_holder}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          payout.status === 'paid' ? 'bg-green-100 text-green-600' :
                          payout.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          payout.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {payout.status === 'paid' ? '✅ Paid' :
                           payout.status === 'rejected' ? '❌ Rejected' :
                           payout.status === 'processing' ? '⏳ Processing' :
                           '🕐 Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payout.status === 'pending' && (
                          <div className="flex flex-col gap-2">
                            <button onClick={() => updatePayout(payout.id, 'processing', payout.user_id, payout.amount)}
                              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                              Processing
                            </button>
                            <button onClick={() => updatePayout(payout.id, 'paid', payout.user_id, payout.amount)}
                              className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                              ✅ Paid
                            </button>
                            <button onClick={() => updatePayout(payout.id, 'rejected', payout.user_id, payout.amount)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                              ❌ Reject
                            </button>
                          </div>
                        )}
                        {payout.status === 'processing' && (
                          <button onClick={() => updatePayout(payout.id, 'paid', payout.user_id, payout.amount)}
                            className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                            ✅ Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Wallet */}
        {activeTab === 'wallet' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">👑 Admin Wallet</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Revenue', value: adminWallet?.total_revenue || 0, icon: '💰', color: 'text-green-500' },
                { label: 'Classroom Commission (10%)', value: adminWallet?.classroom_commission || 0, icon: '🏫', color: 'text-blue-500' },
                { label: 'Book Commission (2%)', value: adminWallet?.book_commission || 0, icon: '📚', color: 'text-purple-500' },
                { label: 'Available Balance', value: adminWallet?.available_balance || 0, icon: '💳', color: 'text-orange-500' },
                { label: 'Total Withdrawn', value: adminWallet?.total_withdrawn || 0, icon: '💸', color: 'text-red-500' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className={`text-2xl font-bold ${item.color}`}>₹{item.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Recent Payments</h3>
              {payments.slice(0, 10).map(payment => (
                <div key={payment.id} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{payment.transaction_id || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{new Date(payment.created_at).toLocaleDateString('hi-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-500">₹{payment.amount}</p>
                    <p className="text-xs text-green-500">Commission: ₹{(payment.amount * 0.10).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}