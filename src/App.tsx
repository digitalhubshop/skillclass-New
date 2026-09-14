import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'
import AdminPanel from './pages/AdminPanel'
import BookStore from './pages/BookStore'
import ClassroomDetail from './pages/ClassroomDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/bookstore" element={<BookStore />} />
      <Route path="/classroom/:id" element={<ClassroomDetail />} />
    </Routes>
  )
}

export default App