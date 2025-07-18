'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    tenantId: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // Lista de universidades (igual que en register)
  const universities = [
    { id: 'UTEC', name: 'Universidad de Ingeniería y Tecnología (UTEC)', country: 'Perú' },
    { id: 'UPC', name: 'Universidad Peruana de Ciencias Aplicadas (UPC)', country: 'Perú' },
    { id: 'PUCP', name: 'Pontificia Universidad Católica del Perú (PUCP)', country: 'Perú' },
    { id: 'UNI', name: 'Universidad Nacional de Ingeniería (UNI)', country: 'Perú' },
    { id: 'UNMSM', name: 'Universidad Nacional Mayor de San Marcos (UNMSM)', country: 'Perú' },
    { id: 'UL', name: 'Universidad de Lima (UL)', country: 'Perú' },
    { id: 'ULIMA', name: 'Universidad Científica del Sur (UCSUR)', country: 'Perú' },
    { id: 'MIT', name: 'Massachusetts Institute of Technology (MIT)', country: 'Estados Unidos' },
    { id: 'STANFORD', name: 'Stanford University', country: 'Estados Unidos' },
    { id: 'UNAM', name: 'Universidad Nacional Autónoma de México (UNAM)', country: 'México' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validaciones
    if (!formData.tenantId) {
      setError('Por favor selecciona tu universidad')
      return
    }

    if (!formData.username.trim()) {
      setError('El nombre de usuario es obligatorio')
      return
    }

    if (!formData.password) {
      setError('La contraseña es obligatoria')
      return
    }

    setLoading(true)

    try {
      // Llamada a tu API de login
      const response = await fetch('https://c0fmkco8rb.execute-api.us-east-1.amazonaws.com/dev/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenant_id: formData.tenantId,
          username: formData.username,
          password: formData.password
        })
      })

      const data = await response.json()

      // Verificar si la respuesta es exitosa (status 200)
      if (response.ok) {
        // Verificar si hay token en la respuesta
        if (data.body && typeof data.body === 'string') {
          // Si body es string, parsearlo
          const bodyData = JSON.parse(data.body)
          if (bodyData.token) {
            // Guardar token y datos del usuario
            const storage = rememberMe ? localStorage : sessionStorage
            storage.setItem('educloud_token', bodyData.token)
            storage.setItem('educloud_user', JSON.stringify({
              username: formData.username,
              tenant_id: formData.tenantId
            }))

            // 🚀 DISPARAR EVENTO PARA ACTUALIZAR EL LOGO
            console.log('✅ Login exitoso, disparando evento userChanged')
            window.dispatchEvent(new Event('userChanged'))

            // Redireccionar al dashboard
            navigate('/')
            return
          }
        } else if (data.token) {
          // Si el token está directamente en data
          const storage = rememberMe ? localStorage : sessionStorage
          storage.setItem('educloud_token', data.token)
          storage.setItem('educloud_user', JSON.stringify({
            username: formData.username,
            tenant_id: formData.tenantId
          }))

          // 🚀 DISPARAR EVENTO PARA ACTUALIZAR EL LOGO
          console.log('✅ Login exitoso, disparando evento userChanged')
          window.dispatchEvent(new Event('userChanged'))

          navigate('/')
          return
        }
        
        // Si llegamos aquí, la respuesta fue 200 pero sin token
        setError('Respuesta inesperada del servidor')
      } else {
        // Error HTTP (4xx, 5xx)
        const errorMessage = data.message || data.error || `Error ${response.status}: ${response.statusText}`
        setError(errorMessage)
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu internet e intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex items-center justify-center py-12 px-4">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2">
            Bienvenido a <span className="text-green-400">EduCloud</span>
          </h2>
          <p className="text-gray-300">
            Inicia sesión para continuar aprendiendo
          </p>
        </div>
        
        {/* Alerta de error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* University Selector */}
              <div>
                <label htmlFor="tenantId" className="block text-sm font-medium text-gray-300 mb-2">
                  Universidad
                </label>
                <select
                  id="tenantId"
                  name="tenantId"
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white transition-all duration-300"
                  value={formData.tenantId}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="" className="bg-gray-800">Selecciona tu universidad...</option>
                  {universities.map((university) => (
                    <option key={university.id} value={university.id} className="bg-gray-800">
                      {university.name} - {university.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Tu nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-400 focus:ring-green-400 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link to="/auth/forgot-password" className="text-green-400 hover:text-green-300 transition-colors duration-300">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-400 to-green-500 text-black font-bold rounded-lg hover:from-green-300 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/auth/register" 
                className="text-green-400 hover:text-green-300 font-medium transition-colors duration-300"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
