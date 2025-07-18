import { Routes, Route } from 'react-router-dom'
import Navbar from './app/components/Navbar'
import Footer from './app/components/Footer'

// Páginas
import Home from './app/page'
import Login from './app/auth/login/page'
import Register from './app/auth/register/page'
import Courses from './app/courses/page'
import CreateCourse from './app/courses/create/page'
import EditCourse from './app/courses/edit/[id]/page'
import CourseDetail from './app/courses/id/page'
import Categories from './app/categories/page'
import Cart from './app/cart/page'
import Dashboard from './app/dashboard/page'
import Instructors from './app/instructors/page'
import Purchases from './app/purchases/page'

function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/create" element={<CreateCourse />} />
          <Route path="/courses/edit/:id" element={<EditCourse />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/purchases" element={<Purchases />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

