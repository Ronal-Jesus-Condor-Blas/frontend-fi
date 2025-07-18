// components/Navbar.tsx - Versión completamente responsive
'use client'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  BookOpen, 
  LogOut,
  Settings,
  CreditCard
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import UniversityLogo from './UniversityLogo'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  // Verificar estado de autenticación
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
      const userData = sessionStorage.getItem('educloud_user') || localStorage.getItem('educloud_user')
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setIsLoggedIn(true)
        setCurrentUser(parsedUser)
      } else {
        setIsLoggedIn(false)
        setCurrentUser(null)
      }
    }

    checkAuthStatus()

    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userChanged', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userChanged', handleStorageChange)
    }
  }, [])

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Cursos', href: '/courses' },
    { name: 'Categorías', href: '/categories' },
    { name: 'Instructores', href: '/instructors' },
  ]

  const handleLogout = () => {
    if (logout) {
      logout()
    }
    
    sessionStorage.removeItem('educloud_token')
    sessionStorage.removeItem('educloud_user')
    localStorage.removeItem('educloud_token')
    localStorage.removeItem('educloud_user')
    
    setIsLoggedIn(false)
    setCurrentUser(null)
    setIsUserMenuOpen(false)
    
    window.dispatchEvent(new Event('userChanged'))
    
    navigate('/')
  }

  const displayUser = user || currentUser
  const isUserLoggedIn = !!user || isLoggedIn

  return (
    <nav className="bg-black shadow-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo EduCloud - Siempre visible */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              <span className="text-lg sm:text-xl font-bold text-white">EduCloud</span>
            </Link>
          </div>

          {/* Desktop Navigation - Solo pantallas grandes */}
          <div className="hidden xl:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-green-400 transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar - Solo pantallas muy grandes */}
          <div className="hidden 2xl:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value
                    if (query.trim()) {
                      navigate(`/courses?search=${encodeURIComponent(query)}`)
                    }
                  }
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* Right side - Contenido responsive */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-green-400 transition-colors duration-200">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-black text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold text-xs">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* University Logo - AL LADO IZQUIERDO DEL AVATAR */}
            {isUserLoggedIn && (
              <div className="hidden sm:block">
                <UniversityLogo size="sm" />
              </div>
            )}

            {/* User Section */}
            {isUserLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 sm:p-2 text-gray-300 hover:text-green-400 transition-colors duration-200 group"
                >
                  <div className="relative">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden shadow-lg hover:shadow-xl hover:shadow-green-400/20">
                      <div className="w-full h-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center text-black font-bold text-xs sm:text-sm rounded-full shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-full"></div>
                        <span className="relative z-10 drop-shadow-sm">
                          {(displayUser?.name?.charAt(0) || displayUser?.username?.charAt(0) || displayUser?.email?.charAt(0) || 'U').toUpperCase()}
                        </span>
                        <div className="absolute inset-0 rounded-full ring-2 ring-green-300/50 group-hover:ring-green-300/80 transition-all duration-300"></div>
                      </div>
                    </div>
                  </div>
                  {/* Username - Solo en pantallas grandes */}
                  <span className="hidden lg:block text-sm font-medium text-white truncate max-w-20">
                    {displayUser?.name || displayUser?.username || displayUser?.email}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-green-400 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Mi Perfil
                    </Link>
                    <Link
                      to="/purchases"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-green-400 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Mis Compras
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-green-400 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configuración
                    </Link>
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons - Responsive */
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button 
                  variant="ghost" 
                  asChild 
                  className="text-gray-300 hover:text-green-400 hover:bg-gray-800 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                >
                  <Link to="/auth/login">
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                    <span className="sm:hidden">Login</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="bg-green-400 text-black hover:bg-green-300 font-semibold text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                >
                  <Link to="/auth/register">
                    <span className="hidden sm:inline">Registrarse</span>
                    <span className="sm:hidden">Sign Up</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 text-gray-300 hover:text-green-400 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Navigation - SIN LOGO DE UNIVERSIDAD */}
        {isMenuOpen && (
          <div className="xl:hidden border-t border-gray-800 py-4">
            
            {/* Mobile Search */}
            <div className="px-4 pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const query = (e.target as HTMLInputElement).value
                      if (query.trim()) {
                        navigate(`/courses?search=${encodeURIComponent(query)}`)
                        setIsMenuOpen(false)
                      }
                    }
                  }}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-3 text-gray-300 hover:bg-green-400/10 hover:text-green-400 active:bg-green-400/20 rounded-md mx-2 transition-all duration-200 font-medium border border-transparent hover:border-green-400/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Overlay para cerrar user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  )
}

