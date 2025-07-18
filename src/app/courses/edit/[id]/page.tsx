import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, AlertCircle, CheckCircle, ArrowLeft, Loader2, User, Clock } from 'lucide-react'

interface UserProfile {
  username: string
  tenant_id: string
}

export default function EditCoursePage() {
  const navigate = useNavigate()
  const params = useParams()
  const courseId = params.id as string

  const [courseData, setCourseData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'Programación',
    estado: 'activo',
    instructor: '',
    duracion_horas: ''
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [courseFound, setCourseFound] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCourseData(prev => ({ ...prev, [name]: value }))
  }

  const handleGoBack = () => {
    navigate(-1) // Navigate back in history
  }

  useEffect(() => {
    const token = sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
    if (token) {
      setIsAuthenticated(true)
    }

    if (courseId) {
      buscarCursoPorId()
    }
  }, [courseId])

  const buscarCursoPorId = async () => {
    setLoadingCourse(true)
    setMessage({ type: '', text: '' })
    
    try {
      const token = sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
      const url = `https://r9ttk3it54.execute-api.us-east-1.amazonaws.com/dev/cursos/buscar/${courseId}`

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': token || '' }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No se encontró el curso con ID: ${courseId}`)
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.curso && data.curso.curso_datos) {
        const { curso_datos } = data.curso
        
        setCourseData({
          nombre: curso_datos.nombre || '',
          descripcion: curso_datos.descripcion || '',
          precio: curso_datos.precio?.toString() || '',
          categoria: curso_datos.categoria || 'Programación',
          estado: curso_datos.estado || 'activo',
          instructor: curso_datos.instructor || '',
          duracion_horas: curso_datos.duracion_horas?.toString() || ''
        })
        setCourseFound(true)
      } else {
        throw new Error('La respuesta de la API no tiene el formato esperado.')
      }

    } catch (error) {
      console.error('💥 Error al buscar el curso por ID:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : String(error) })
      setCourseFound(false)
    } finally {
      setLoadingCourse(false)
    }
  }

  const handleModificarCurso = async () => {
    if (!isAuthenticated || !courseData.nombre || !courseData.descripcion || !courseData.precio) {
      setMessage({ type: 'error', text: 'Todos los campos obligatorios deben ser completados.' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const token = sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
      const url = `https://r9ttk3it54.execute-api.us-east-1.amazonaws.com/dev/cursos/modificar/${courseId}`

      const datosParaEnviar = {
        nombre: courseData.nombre,
        descripcion: courseData.descripcion,
        precio: parseFloat(courseData.precio),
        categoria: courseData.categoria,
        estado: courseData.estado,
        instructor: courseData.instructor,
        duracion_horas: courseData.duracion_horas ? parseInt(courseData.duracion_horas, 10) : undefined
      }
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify(datosParaEnviar)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.mensaje || `Error ${response.status}`)
      }
      
      setMessage({ type: 'success', text: '¡Curso modificado exitosamente! Redirigiendo...' })
      localStorage.setItem('force_course_refresh', 'true')
      
      setTimeout(() => {
        navigate('/courses')
      }, 2000)
        
    } catch (error) {
      console.error('💥 Error de conexión:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error al modificar el curso' })
    } finally {
      setLoading(false)
    }
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
              Editar Curso
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Modifica la información del curso
            </p>
          </div>
          {!isAuthenticated ? (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <div>
                  <p className="text-red-100 font-medium">Acceso denegado</p>
                  <p className="text-red-200 text-sm">Debes iniciar sesión para editar cursos</p>
                </div>
              </div>
            </div>
          ) : loadingCourse ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Cargando curso...</p>
              </div>
            </div>
          ) : !courseFound ? (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <div>
                  <p className="text-red-100 font-medium">Curso no encontrado</p>
                  <p className="text-red-200 text-sm">No se pudo encontrar el curso con ID: {courseId}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
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
                <form onSubmit={(e) => { e.preventDefault(); handleModificarCurso(); }} className="space-y-4 sm:space-y-6">
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
                      rows={4}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base transition-colors resize-none"
                      placeholder="Describe el contenido y objetivos del curso"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base transition-colors"
                        placeholder="0.00"
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
                        <option value="Data Science">Data Science</option>
                        <option value="Desarrollo Personal">Desarrollo Personal</option>
                        <option value="Idiomas">Idiomas</option>
                        <option value="Música">Música</option>
                        <option value="Fotografía">Fotografía</option>
                        <option value="Salud y Bienestar">Salud y Bienestar</option>
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
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Modificando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Modificar Curso
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    )
}