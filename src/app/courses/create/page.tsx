import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, AlertCircle, CheckCircle, ArrowLeft, User, Clock } from 'lucide-react'

interface UserProfile {
  username: string
  tenant_id: string
}

export default function CreateCoursePage() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [courseData, setCourseData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'Programación',
    estado: 'activo',
    instructor: '',
    duracion_horas: ''
  })

  useEffect(() => {
    const token = sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
    const userData = sessionStorage.getItem('educloud_user') || localStorage.getItem('educloud_user')
    
    if (token && userData) {
      setIsAuthenticated(true)
      try {
        setUserProfile(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handleCreateCourse = async () => {
    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Debes iniciar sesión para crear un curso' })
      return
    }

    if (!courseData.nombre || !courseData.descripcion || !courseData.precio) {
      setMessage({ type: 'error', text: 'Todos los campos obligatorios deben ser completados' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const token = sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
      
      const response = await fetch('https://r9ttk3it54.execute-api.us-east-1.amazonaws.com/dev/cursos/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({
          curso_datos: {
            nombre: courseData.nombre,
            descripcion: courseData.descripcion,
            precio: parseFloat(courseData.precio),
            categoria: courseData.categoria,
            estado: courseData.estado,
            instructor: courseData.instructor,
            duracion_horas: courseData.duracion_horas ? parseInt(courseData.duracion_horas, 10) : undefined
          }
        })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Curso creado exitosamente' })
        setCourseData({
          nombre: '',
          descripcion: '',
          precio: '',
          categoria: 'Programación',
          estado: 'activo',
          instructor: '',
          duracion_horas: ''
        })
        
        setTimeout(() => {
          navigate('/courses', { replace: true })
          // Set a flag to force reload
          localStorage.setItem('force_course_refresh', 'true')
        }, 2000)
      } else {
        setMessage({ type: 'error', text: result.mensaje || 'Error al crear el curso' })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Error de conexión al crear el curso' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGoBack = () => {
    navigate(-1) // Navigate back in history
  }

  const LoginPrompt = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md text-center">
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Acceso Requerido</h2>
        <p className="text-gray-300 mb-6 text-sm sm:text-base">
          Debes iniciar sesión para crear cursos
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/auth/login')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => navigate('/auth/register')}
            className="w-full bg-transparent border border-green-500 text-green-400 hover:bg-green-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  )

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black pb-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <button 
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
              <span className="text-sm sm:text-base">Volver</span>
            </button>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Crear Nuevo Curso
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Completa la información para crear un nuevo curso
            </p>
          </div>

          {message.text && (
            <div className={`mb-4 p-4 rounded-lg border flex items-start space-x-3 ${
              message.type === 'success' 
                ? 'bg-green-900/50 border-green-500 text-green-100' 
                : 'bg-red-900/50 border-red-500 text-red-100'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <span className="text-sm sm:text-base">{message.text}</span>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4 sm:p-6 lg:p-8 mb-0">
            <form onSubmit={(e) => { e.preventDefault(); handleCreateCourse(); }} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Curso *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={courseData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base transition-colors"
                  placeholder="Ej: Curso de Node.js con Serverless"
                  required
                />
              </div>
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={courseData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm sm:text-base transition-colors"
                  placeholder="Aprende a crear APIs serverless con AWS..."
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="precio" className="block text-sm font-medium text-gray-300 mb-2">
                    Precio (USD) *
                  </label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={courseData.precio}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base transition-colors"
                    placeholder="59.99"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-300 mb-2">
                    Categoría *
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={courseData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base transition-colors"
                    required
                  >
                    <option value="Programación">Programación</option>
                    <option value="Diseño">Diseño</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Negocios">Negocios</option>
                    <option value="Desarrollo Personal">Desarrollo Personal</option>
                    <option value="Idiomas">Idiomas</option>
                    <option value="Ciencias">Ciencias</option>
                    <option value="Arte">Arte</option>
                    <option value="Música">Música</option>
                    <option value="Fotografía">Fotografía</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="instructor" className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="inline-block w-4 h-4 mr-1" />
                    Instructor
                  </label>
                  <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    value={courseData.instructor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base transition-colors"
                    placeholder="Ej: Fernando Herrera"
                  />
                </div>
                <div>
                  <label htmlFor="duracion_horas" className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock className="inline-block w-4 h-4 mr-1" />
                    Duración (en horas)
                  </label>
                  <input
                    type="number"
                    id="duracion_horas"
                    name="duracion_horas"
                    value={courseData.duracion_horas}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base transition-colors"
                    placeholder="40"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-300 mb-2">
                  Estado del Curso
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={courseData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base transition-colors"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="borrador">Borrador</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Crear Curso</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCourseData({
                    nombre: '',
                    descripcion: '',
                    precio: '',
                    categoria: 'Programación',
                    estado: 'activo',
                    instructor: '',
                    duracion_horas: ''
                  })}
                  className="sm:w-auto px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}