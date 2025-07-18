'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  User, 
  ArrowLeft, 
  AlertCircle,
  Loader2,
  CheckCircle,
  BookOpen,
  Star
} from 'lucide-react'

interface Purchase {
  compra_id: string
  curso_id: string
  nombre_curso: string
  monto_pagado: number
  fecha_compra: string
  usuario_id: string
  curso_detalle?: {
    nombre?: string
    descripcion?: string
    categoria?: string
    instructor?: string
    duracion_horas?: number
    precio?: number
  }
}

export default function PurchasesPage() {
  const navigate = useNavigate()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
    if (isAuthenticated) {
      loadPurchases()
    }
  }, [isAuthenticated])

  const checkAuthStatus = () => {
    const token = sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
    setIsAuthenticated(!!token)
    if (!token) {
      navigate('/auth/login')
    }
  }

  const getAuthToken = () => {
    return sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
  }

  const loadPurchases = async () => {
    try {
      setLoading(true)
      setError('')
      
      const token = getAuthToken()
      
      console.log('📋 Cargando compras realizadas...')
      
      const response = await fetch('https://isyijuphfl.execute-api.us-east-1.amazonaws.com/prod/compras/listar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({})
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('✅ Compras cargadas:', result)
      
      setPurchases(result.compras || [])
      
    } catch (error: any) {
      console.error('❌ Error cargando compras:', error)
      setError(`Error al cargar compras: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalGastado = purchases.reduce((sum, purchase) => sum + purchase.monto_pagado, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Cargando compras...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-20 w-20 text-red-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h1>
          <p className="text-gray-400 mb-8">Debes iniciar sesión para ver tus compras</p>
          <Link
            to="/auth/login"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/courses"
            className="text-green-400 hover:text-green-300 font-medium flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Catálogo
          </Link>
          <h1 className="text-3xl font-bold text-white">Mis Compras</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-100 font-medium">Error</p>
              <p className="text-red-200 text-sm">{error}</p>
              <button
                onClick={loadPurchases}
                className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {purchases.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700">
              <ShoppingBag className="h-20 w-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">
                No tienes compras realizadas
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Explora nuestro catálogo y encuentra los cursos perfectos para ti
              </p>
              <Link
                to="/courses"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg transition-colors font-medium"
              >
                Explorar Cursos
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Cursos Comprados</p>
                    <p className="text-2xl font-bold text-white">{purchases.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Gastado</p>
                    <p className="text-2xl font-bold text-green-400">${totalGastado.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Promedio por Curso</p>
                    <p className="text-2xl font-bold text-white">
                      ${purchases.length > 0 ? (totalGastado / purchases.length).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </div>

            {/* Lista de Compras */}
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-green-400" />
                Historial de Compras
              </h2>

              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div key={purchase.compra_id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-xs text-green-400 font-medium">COMPRA EXITOSA</span>
                        </div>
                        
                        <h3 className="font-semibold text-lg text-white mb-1">
                          {purchase.curso_detalle?.nombre || purchase.nombre_curso}
                        </h3>
                        
                        {purchase.curso_detalle?.categoria && (
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                            {purchase.curso_detalle.categoria}
                          </span>
                        )}
                        
                        {purchase.curso_detalle?.instructor && (
                          <p className="text-gray-400 text-sm mt-1">
                            Por {purchase.curso_detalle.instructor}
                          </p>
                        )}
                        
                        {purchase.curso_detalle?.descripcion && (
                          <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                            {purchase.curso_detalle.descripcion}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold text-green-400">
                          ${purchase.monto_pagado.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatDate(purchase.fecha_compra)}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          ID: {purchase.compra_id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    
                    {purchase.curso_detalle?.duracion_horas && (
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-3 pt-3 border-t border-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {purchase.curso_detalle.duracion_horas}h de contenido
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Acceso de por vida
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
