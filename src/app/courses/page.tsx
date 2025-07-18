import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { 
  Search, Plus, Edit, Trash2, GraduationCap, User, Clock, AlertCircle, 
  Loader2, RefreshCw, Star, ChevronLeft, ChevronRight, CheckCircle, ShoppingCart,
  Filter, Grid, List, TrendingUp, Award, PlayCircle, Users, BookOpen,
  Eye, Heart, Share2, MoreHorizontal, Sparkles, Zap, Target, Shield
} from 'lucide-react'

interface ApiCourse {
  curso_id: string
  tenant_id: string
  curso_datos: {
    descripcion: string
    precio: number
    instructor?: string
    etiquetas?: string[]
    duracion_horas?: number
    fecha_creacion?: string
    nivel?: string
    publicado?: boolean
    nombre?: string
    categoria?: string
    estado?: string
  }
}

interface DisplayCourse {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  estado: string
  instructor?: string
  duracion?: string
  etiquetas?: string[]
  nivel?: string
  students?: number
  rating?: number
  isNew?: boolean
  isBestseller?: boolean
  discount?: number
}

export default function CoursesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [allCourses, setAllCourses] = useState<DisplayCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [refreshMessage, setRefreshMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [coursesPerPage] = useState(9)
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [filterCategory, setFilterCategory] = useState('all')
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<string[]>([])

  useEffect(() => {
    checkAuthStatus()
    loadCartItems()
    
    const urlParams = new URLSearchParams(location.search)
    const forceReload = urlParams.get('force_reload')
    const forceRefreshFromStorage = localStorage.getItem('force_course_refresh') === 'true'
    
    if (forceReload || forceRefreshFromStorage) {
      // Clean up URL without query params
      navigate('/courses', { replace: true })
      localStorage.removeItem('force_course_refresh')
      
      setRefreshMessage('✨ Cursos actualizados exitosamente')
      setTimeout(() => setRefreshMessage(''), 5000)
      
      fetchCourses({ forceRefresh: true })
    } else {
      fetchCourses()
    }
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy, filterCategory])

  const loadCartItems = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart.map((item: any) => item.id))
  }

  const checkAuthStatus = () => {
    if (typeof window === 'undefined') return
    const token = sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
    setIsAuthenticated(!!token)
  }

  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
  }

  const convertApiToDisplay = (apiCourses: ApiCourse[]): DisplayCourse[] => {
    return apiCourses.map((apiCourse, index) => ({
      id: apiCourse.curso_id || `curso-${index}`,
      nombre: apiCourse.curso_datos.nombre || 'Curso sin nombre',
      descripcion: apiCourse.curso_datos.descripcion || 'Sin descripción',
      precio: apiCourse.curso_datos.precio || 0,
      categoria: apiCourse.curso_datos.categoria || 'Sin categoría',
      estado: apiCourse.curso_datos.estado || 'activo',
      instructor: apiCourse.curso_datos.instructor || 'Instructor no especificado',
      duracion: apiCourse.curso_datos.duracion_horas ? `${apiCourse.curso_datos.duracion_horas}h` : 'Duración no especificada',
      etiquetas: apiCourse.curso_datos.etiquetas || [],
      nivel: apiCourse.curso_datos.nivel || 'Intermedio',
      students: Math.floor(Math.random() * 5000) + 100,
      rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
      isNew: Math.random() > 0.8,
      isBestseller: Math.random() > 0.85,
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0
    }))
  }

  const fetchCourses = async ({ forceRefresh = false } = {}) => {
    setLoading(true)
    setError(forceRefresh ? '🔄 Sincronizando con servidor...' : '')
      
    try {
      if (!isOnline) throw new Error('Sin conexión a internet')

      let allCoursesData: DisplayCourse[] = []
      let lastKey: string | null = null
      let totalRequests = 0
      const maxRequests = 30
      
      do {
        const token = getAuthToken()
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (token) headers['Authorization'] = token

        let url = "https://r9ttk3it54.execute-api.us-east-1.amazonaws.com/dev/cursos/listar?limit=50"
        if (lastKey) url += `&lastKey=${lastKey}`
        if (forceRefresh) url += `&_force=${Date.now()}`

        const response = await fetch(url, { method: 'GET', headers })

        if (response.status === 401) {
          setError('⚠ Sesión expirada. Algunos cursos podrían no estar disponibles.')
          break
        }
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`)

        const data = await response.json()
        if (data.cursos && Array.isArray(data.cursos)) {
          allCoursesData = [...allCoursesData, ...convertApiToDisplay(data.cursos)]
        }

        lastKey = data.lastEvaluatedKey || null
        totalRequests++
        setError(`🔄 Cargando... ${allCoursesData.length} cursos encontrados`)

      } while (lastKey && totalRequests < maxRequests)

      setAllCourses(allCoursesData)
      setError(allCoursesData.length === 0 ? '🎯 No se encontraron cursos' : '')

    } catch (error: any) {
      console.error('❌ Error cargando cursos:', error)
      setError(`❌ Error: ${error.message}`)
      setAllCourses([])
    } finally {
      setLoading(false)
    }
  }
  
  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!isAuthenticated) {
      handleAuthRequired()
      return
    }

    const confirmDelete = confirm(
      `⚠️ CONFIRMAR ELIMINACIÓN\n\n` +
      `📚 Curso: "${courseName}"\n` +
      `🆔 ID: ${courseId}\n\n` +
      `🚨 ADVERTENCIA:\n` +
      `• Esta acción no se puede deshacer\n` +
      `• Se eliminará permanentemente\n` +
      `• Los estudiantes perderán acceso\n\n` +
      `¿Estás completamente seguro?`
    )

    if (!confirmDelete) return

    try {
      setDeletingCourse(courseId)
      setError('')
      setRefreshMessage('')

      const token = getAuthToken()
      
      console.log(`🗑️ Iniciando eliminación: ${courseName} (ID: ${courseId})`)
      
      const response = await fetch(`https://r9ttk3it54.execute-api.us-east-1.amazonaws.com/dev/cursos/eliminar/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token || ''
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.mensaje || `Error ${response.status}: ${response.statusText}`)
      }

      console.log('✅ Curso eliminado exitosamente:', result)
      
      setAllCourses(prevCourses => prevCourses.filter(course => course.id !== courseId))
      setRefreshMessage(`✨ ${result.mensaje || `Curso "${courseName}" eliminado correctamente`}`)
      setTimeout(() => setRefreshMessage(''), 6000)
      
      setTimeout(() => {
        console.log('🔄 Sincronizando con servidor...')
        fetchCourses({ forceRefresh: true })
      }, 2000)

    } catch (error: any) {
      console.error('❌ Error eliminando curso:', error)
      setError(`❌ Error al eliminar "${courseName}": ${error.message}`)
      setTimeout(() => setError(''), 8000)
    } finally {
      setDeletingCourse(null)
    }
  }

  const handleAddToCart = (course: DisplayCourse) => {
    console.log('🛒 Agregando al carrito:', course.nombre)
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === course.id)
    
    if (!existingItem) {
      const newItem = {
        id: course.id,
        nombre: course.nombre,
        precio: course.precio,
        categoria: course.categoria,
        instructor: course.instructor,
        quantity: 1
      }
      cart.push(newItem)
      localStorage.setItem('cart', JSON.stringify(cart))
      setCartItems(prev => [...prev, course.id])
      
      // Mostrar notificación
      setRefreshMessage(`🛒 "${course.nombre}" agregado al carrito`)
      setTimeout(() => setRefreshMessage(''), 3000)
    } else {
      navigate('/cart')
    }
  }

  const categories = ['all', 'programacion', 'diseno', 'marketing', 'negocios', 'datos', 'idiomas']
  
  const filteredCourses = allCourses
    .filter(course => {
      const matchesSearch = course.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = filterCategory === 'all' || course.categoria.toLowerCase() === filterCategory
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.precio - b.precio
        case 'price-high': return b.precio - a.precio
        case 'rating': return (b.rating || 0) - (a.rating || 0)
        case 'popular': return (b.students || 0) - (a.students || 0)
        default: return 0
      }
    })

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
  const startIndex = (currentPage - 1) * coursesPerPage
  const endIndex = startIndex + coursesPerPage
  const currentCourses = filteredCourses.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 10
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 6) {
        for (let i = 1; i <= 8; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 5) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 7; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  const handleAuthRequired = () => navigate('/auth/login')
  const handleCreateCourse = () => {
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }
    navigate('/courses/create')
  }
  const handleEditCourse = (course: DisplayCourse) => {
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }
    navigate(`/courses/edit/${course.id}`)
  }
  const handleManualReload = () => {
    setRefreshMessage('')
    fetchCourses({ forceRefresh: true })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'programacion': 'from-blue-500 to-blue-600',
      'diseno': 'from-purple-500 to-purple-600',
      'marketing': 'from-pink-500 to-pink-600',
      'negocios': 'from-orange-500 to-orange-600',
      'datos': 'from-red-500 to-red-600',
      'idiomas': 'from-teal-500 to-teal-600'
    }
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getLevelColor = (level: string) => {
    const colors = {
      'Principiante': 'bg-green-500/20 text-green-400',
      'Intermedio': 'bg-yellow-500/20 text-yellow-400',
      'Avanzado': 'bg-red-500/20 text-red-400'
    }
    return colors[level as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  const renderCourseCard = (course: DisplayCourse) => {
    const isInCart = cartItems.includes(course.id)
    const isHovered = hoveredCourse === course.id
    
    return (
      <div 
        key={course.id}
        className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border transition-all duration-500 hover:shadow-2xl overflow-hidden ${
          deletingCourse === course.id 
            ? 'border-red-500/50 opacity-50 cursor-not-allowed' 
            : 'border-gray-700 hover:border-green-500/50 hover:scale-105'
        }`}
        onMouseEnter={() => setHoveredCourse(course.id)}
        onMouseLeave={() => setHoveredCourse(null)}
      >
        {/* Overlay de eliminación */}
        {deletingCourse === course.id && (
          <div className="absolute inset-0 bg-red-900/20 rounded-2xl flex items-center justify-center z-20">
            <div className="bg-red-900/90 backdrop-blur-sm text-red-100 px-6 py-3 rounded-xl flex items-center gap-3 shadow-2xl">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-medium">Eliminando curso...</span>
            </div>
          </div>
        )}

        {/* Efecto de brillo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Header con gradiente */}
        <div className={`h-48 bg-gradient-to-br ${getCategoryColor(course.categoria)} relative overflow-hidden`}>
          {/* Imagen de fondo del curso */}
          <div className="absolute inset-0">
            <img
              src={`https://picsum.photos/400/300?random=${course.id}`}
              alt={course.nombre}
              className="w-full h-full object-cover opacity-60"
              onError={(e) => {
                // Fallback si la imagen no carga
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          
          {/* Overlay con gradiente */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(course.categoria)} opacity-70`}></div>
          
          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute top-8 right-8 w-8 h-8 bg-white/30 rounded-full blur-md"></div>
            <div className="absolute bottom-6 left-8 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
          </div>

          {/* Badges superiores */}
          <div className="absolute top-4 left-4 flex gap-2">
            {course.isNew && (
              <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                NUEVO
              </div>
            )}
            {course.isBestseller && (
              <div className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Award className="h-3 w-3" />
                BESTSELLER
              </div>
            )}
            {course.discount && course.discount > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                -{course.discount}%
              </div>
            )}
          </div>

          {/* Controles superiores */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
              <Heart className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            {isAuthenticated && (
              <div className="relative">
                <button className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {/* Menú contextual */}
                <div className="absolute top-full right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 min-w-[120px] opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id, course.nombre)}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Icono de play central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 ${
              isHovered ? 'scale-110 bg-black/50' : 'scale-100'
            }`}>
              <PlayCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Categoría y nivel */}
          <div className="flex items-center justify-between mb-4">
            <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-medium">
              {course.categoria}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(course.nivel || 'Intermedio')}`}>
              {course.nivel || 'Intermedio'}
            </span>
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-green-400 transition-colors">
            {course.nombre}
          </h3>

          {/* Descripción */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {course.descripcion}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{course.instructor}</p>
              <p className="text-gray-400 text-xs">Instructor</p>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-white font-bold">{course.rating}</span>
              </div>
              <span className="text-gray-400 text-xs">Rating</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-white font-bold">{(course.students || 0).toLocaleString()}</span>
              </div>
              <span className="text-gray-400 text-xs">Estudiantes</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-white font-bold">{course.duracion}</span>
              </div>
              <span className="text-gray-400 text-xs">Duración</span>
            </div>
          </div>

          {/* Precio y carrito */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              {course.discount && course.discount > 0 ? (
                <>
                  <span className="text-2xl font-bold text-green-400">
                    ${(course.precio * (1 - course.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${course.precio.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-green-400">
                  ${course.precio.toFixed(2)}
                </span>
              )}
            </div>

            {/* Botón de carrito mejorado */}
            <button 
              onClick={() => handleAddToCart(course)}
              disabled={deletingCourse === course.id}
              className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isInCart
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-green-500/25'
              } ${
                deletingCourse === course.id
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {isInCart ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>En Carrito</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    <span>Agregar</span>
                  </>
                )}
              </div>
              
              {/* Efecto de brillo en el botón */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500 rounded-xl"></div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative py-20 px-4 overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-green-500/30">
              <Sparkles className="h-4 w-4" />
              Catálogo Premium
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
              Transforma tu
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600"> Futuro</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Descubre cursos de clase mundial diseñados por expertos de la industria. 
              Aprende habilidades demandadas y acelera tu carrera profesional.
            </p>

            {/* Stats mejoradas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">1000+</div>
                <div className="text-gray-400">Cursos Premium</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
                <div className="text-gray-400">Estudiantes Activos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">95%</div>
                <div className="text-gray-400">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
                <div className="text-gray-400">Soporte</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes de estado */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        {refreshMessage && (
          <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 backdrop-blur-sm border border-green-500/50 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <p className="text-green-100 font-medium">{refreshMessage}</p>
            </div>
          </div>
        )}
        
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 backdrop-blur-sm border border-blue-500/50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-400 mr-3" />
                <div>
                  <p className="text-blue-100 font-medium">Acceso Limitado</p>
                  <p className="text-blue-200 text-sm">Inicia sesión para gestionar cursos y acceder a funciones premium</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/auth/login')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className={`rounded-xl p-4 mb-6 backdrop-blur-sm border ${
            error.includes('🎯') ? 'bg-yellow-900/50 border-yellow-500/50' : 
            error.includes('✨') ? 'bg-green-900/50 border-green-500/50' :
            error.includes('🔄') ? 'bg-blue-900/50 border-blue-500/50' :
            error.includes('⚠') ? 'bg-orange-900/50 border-orange-500/50' :
            'bg-red-900/50 border-red-500/50'
          }`}>
            <div className="flex items-start">
              <AlertCircle className={`h-5 w-5 mr-3 mt-0.5 ${
                error.includes('🎯') ? 'text-yellow-400' :
                error.includes('✨') ? 'text-green-400' :
                error.includes('🔄') ? 'text-blue-400' :
                error.includes('⚠') ? 'text-orange-400' :
                'text-red-400'
              }`} />
              <div className="flex-1">
                <p className={`font-medium ${
                  error.includes('🎯') ? 'text-yellow-100' :
                  error.includes('✨') ? 'text-green-100' :
                  error.includes('🔄') ? 'text-blue-100' :
                  error.includes('⚠') ? 'text-orange-100' :
                  'text-red-100'
                }`}>
                  {error}
                </p>
              </div>
              {!error.includes('✨') && !error.includes('🔄') && (
                <button
                  onClick={handleManualReload}
                  className="ml-3 text-red-400 hover:text-red-300 text-sm underline"
                >
                  Reintentar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controles y filtros */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-6">
          {/* Primera fila: Búsqueda y botones principales */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-6">
            {/* Búsqueda mejorada */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar cursos, instructores, categorías..."
                className="w-full pl-12 pr-4 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 items-center">
              {/* Controles de vista */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Vista:</span>
                <div className="flex bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-green-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-green-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {isAuthenticated && (
                <button
                  onClick={handleCreateCourse}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium shadow-lg shadow-green-500/25"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Crear Curso</span>
                </button>
              )}
              
              <button
                onClick={handleManualReload}
                disabled={loading}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-700 disabled:to-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium disabled:opacity-50 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>
          </div>


        </div>

        {/* Contador de resultados */}
        {!loading && filteredCourses.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Mostrando <span className="text-green-400 font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredCourses.length)}</span> de <span className="text-green-400 font-semibold">{filteredCourses.length}</span> cursos
              {searchTerm && <span> para "<span className="text-white">{searchTerm}</span>"</span>}
            </p>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Cargando Cursos Premium
              </h3>
              <p className="text-gray-400 text-lg mb-2">
                {refreshMessage ? 'Sincronizando con servidor...' : 'Obteniendo el mejor contenido...'}
              </p>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Optimizando tu experiencia</span>
              </div>
            </div>
          </div>
        ) : currentCourses.length === 0 ? (
          <div className="text-center py-32">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-16 border border-gray-700 max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Search className="h-4 w-4 text-black" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">
                {searchTerm ? 'No encontramos cursos' : 'Catálogo Vacío'}
              </h3>
              
              <p className="text-gray-400 mb-8 text-lg">
                {searchTerm 
                  ? `No hay cursos que coincidan con "${searchTerm}". Prueba con otros términos de búsqueda.`
                  : 'Sé pionero y crea el primer curso de nuestra plataforma'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    Ver Todos los Cursos
                  </button>
                ) : (
                  isAuthenticated && (
                    <button
                      onClick={handleCreateCourse}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Crear Primer Curso
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Grid de cursos */}
            <div className={`grid gap-8 mb-12 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {currentCourses.map((course) => renderCourseCard(course))}
            </div>
            
            {/* Paginación mejorada */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 py-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl border border-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === '...' ? (
                        <span className="px-4 py-2 text-gray-400">...</span>
                      ) : (
                        <button
                          onClick={() => setCurrentPage(page as number)}
                          className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg shadow-green-500/25'
                              : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl border border-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}