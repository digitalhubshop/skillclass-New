import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'
import SellerDashboard from './pages/SellerDashboard'
import AdminPanel from './pages/AdminPanel'
import BookStore from './pages/BookStore'
import ClassroomDetail from './pages/ClassroomDetail'
import LiveClass from './pages/LiveClass'
import Payment from './pages/Payment'
import Review from './pages/Review'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/bookstore" element={<BookStore />} />
      <Route path="/classroom/:id" element={<ClassroomDetail />} />
      <Route path="/live/:id" element={<LiveClass />} />
      <Route path="/payment/:type/:id" element={<Payment />} />
      <Route path="/review/:classroomId" element={<Review />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App