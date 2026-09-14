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
  const [stats, setStats] = useState({
    totalUsers: 0, totalTeachers: 0, totalStudents: 0, totalSellers: 0,
    totalClassrooms: 0, totalBooks: 0, pendingPayouts: 0
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
    const [usersRes, classroomsRes, booksRes, payoutsRes] = await Promise.all([
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('classrooms').select('*, users(full_name)').order('created_at', { ascending: false }),
      supabase.from('books').select('*, users(full_name)').order('created_at', { ascending: false }),
      supabase.from('payout_requests').select('*, users(full_name)').order('created_at', { ascending: false }),
    ])

    setUsers(usersRes.data || [])
    setClassrooms(classroomsRes.data || [])
    setBooks(booksRes.data || [])
    setPayouts(payoutsRes.data || [])

    const u = usersRes.data || []
    setStats({
      totalUsers: u.length,
      totalTeachers: u.filter((x: any) => x.account_type === 'teacher').length,
      totalStudents: u.filter((x: any) => x.account_type === 'student').length,
      totalSellers: u.filter((x: any) => x.account_type === 'seller').length,
      totalClassrooms: classroomsRes.data?.length || 0,
      totalBooks: booksRes.data?.length || 0,
      pendingPayouts: payoutsRes.data?.filter((x: any) => x.status === 'pending').length || 0,
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

  const updatePayout = async (id: string, status: string) => {
    await supabase.from('payout_requests').update({ status }).eq('id', id)
    loadData()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-400">👑 SkillClass Admin Panel</h1>
          <button onClick={handleLogout} className="px-4 py-2 text-red-400 border border-red-400 rounded-lg hover:bg-red-900">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b overflow-x-auto">
          {['overview', 'users', 'classrooms', 'books', 'payouts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
              { label: 'Teachers', value: stats.totalTeachers, icon: '👨‍🏫' },
              { label: 'Students', value: stats.totalStudents, icon: '👨‍🎓' },
              { label: 'Sellers', value: stats.totalSellers, icon: '🛍️' },
              { label: 'Classrooms', value: stats.totalClassrooms, icon: '🏫' },
              { label: 'Books', value: stats.totalBooks, icon: '📚' },
              { label: 'Pending Payouts', value: stats.pendingPayouts, icon: '💰' },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Users</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded capitalize">
                          {user.account_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.state}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${user.is_approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {user.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!user.is_approved && (
                            <button onClick={() => approveUser(user.id)} className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                              Approve
                            </button>
                          )}
                          <button onClick={() => blockUser(user.id, user.is_blocked)} className={`px-3 py-1 rounded text-xs text-white ${user.is_blocked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}>
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
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Classrooms</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                        <div className="text-sm text-gray-500">{cls.category}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{cls.users?.full_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-orange-500">₹{cls.fee}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${cls.is_approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {cls.is_approved ? 'Approved' : 'Pending'}
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
            <h2 className="text-xl font-bold text-gray-800 mb-6">All Books</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                        <div className="text-sm text-gray-500">{book.category}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{book.users?.full_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-orange-500">₹{book.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${book.is_approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {book.is_approved ? 'Approved' : 'Pending'}
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

        {/* Payouts */}
        {activeTab === 'payouts' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payout Requests</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">User</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Method</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payouts.map(payout => (
                    <tr key={payout.id}>
                      <td className="px-6 py-4 font-medium text-gray-800">{payout.users?.full_name}</td>
                      <td className="px-6 py-4 text-orange-500 font-semibold">₹{payout.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 uppercase">{payout.method}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          payout.status === 'paid' ? 'bg-green-100 text-green-600' :
                          payout.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payout.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => updatePayout(payout.id, 'paid')} className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                              Pay
                            </button>
                            <button onClick={() => updatePayout(payout.id, 'rejected')} className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}