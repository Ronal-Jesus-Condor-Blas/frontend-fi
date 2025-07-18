'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  CreditCard,
  Shield,
  Award,
  Monitor,
  ShoppingBag
} from 'lucide-react'

interface CartItem {
  id: string
  nombre: string
  precio: number
  categoria: string
  instructor: string
  quantity: number
}

interface PurchaseData {
  curso_id: string
  nombre_curso: string
  monto_pagado: number
}

export default function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
    loadCartFromStorage()
  }, [])

  const checkAuthStatus = () => {
    const token = sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
    setIsAuthenticated(!!token)
  }

  const getAuthToken = () => {
    return sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token')
  }

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        // Asegurar que cada item tenga quantity
        const cartWithQuantity = parsedCart.map((item: any) => ({
          ...item,
          quantity: item.quantity || 1
        }))
        setCartItems(cartWithQuantity)
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveCartToStorage = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items))
  }

  const removeFromCart = (id: string) => {
    const newItems = cartItems.filter(item => item.id !== id)
    setCartItems(newItems)
    saveCartToStorage(newItems)
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }
    
    const newItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(newItems)
    saveCartToStorage(newItems)
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0)
  const descuentos = 0 // Puedes agregar lógica de descuentos aquí
  const total = subtotal - descuentos

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Debes iniciar sesión para realizar la compra' })
      return
    }

    if (cartItems.length === 0) {
      setMessage({ type: 'error', text: 'No hay cursos en el carrito' })
      return
    }

    setPurchasing(true)
    setMessage({ type: '', text: '' })

    try {
      const token = getAuthToken()
      const comprasExitosas = []
      const comprasFallidas = []

      // Procesar cada curso individualmente
      for (const item of cartItems) {
        // Procesar según la cantidad (si quantity > 1, registrar múltiples compras)
        for (let i = 0; i < item.quantity; i++) {
          try {
            const purchaseData: PurchaseData = {
              curso_id: item.id,
              nombre_curso: item.nombre,
              monto_pagado: item.precio
            }

            console.log('🛒 Registrando compra:', purchaseData)

            const response = await fetch('https://isyijuphfl.execute-api.us-east-1.amazonaws.com/prod/compras/registrar', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token || ''
              },
              body: JSON.stringify(purchaseData)
            })

            const result = await response.json()

            if (response.ok) {
              comprasExitosas.push({
                curso: item.nombre,
                compra_id: result.compra_id
              })
            } else {
              comprasFallidas.push({
                curso: item.nombre,
                error: result.error || 'Error desconocido'
              })
              break // Si falla una compra de este curso, no continuar con las demás
            }
          } catch (error) {
            console.error(`Error comprando ${item.nombre}:`, error)
            comprasFallidas.push({
              curso: item.nombre,
              error: 'Error de conexión'
            })
            break
          }
        }
      }

      // Mostrar resultados
      if (comprasExitosas.length > 0) {
        setMessage({ 
          type: 'success', 
          text: `✅ ${comprasExitosas.length} curso${comprasExitosas.length > 1 ? 's' : ''} comprado${comprasExitosas.length > 1 ? 's' : ''} exitosamente!` 
        })
        
        // Limpiar carrito solo si todas las compras fueron exitosas
        if (comprasFallidas.length === 0) {
          clearCart()
          
          // Redirigir a página de éxito después de 3 segundos
          setTimeout(() => {
            navigate('/purchases') // o la página que prefieras
          }, 3000)
        }
      }

      if (comprasFallidas.length > 0) {
        setMessage({ 
          type: 'error', 
          text: `❌ Error en ${comprasFallidas.length} curso${comprasFallidas.length > 1 ? 's' : ''}: ${comprasFallidas.map(f => f.error).join(', ')}`
        })
      }

    } catch (error) {
      console.error('Error en compra:', error)
      setMessage({ type: 'error', text: 'Error de conexión al procesar la compra' })
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Cargando carrito...</p>
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
            Seguir Comprando
          </Link>
          <h1 className="text-3xl font-bold text-white">Carrito de Compras</h1>
        </div>

        {/* Mensaje */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border flex items-start space-x-3 ${
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items del carrito */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-400" />
                {cartItems.length} {cartItems.length === 1 ? 'curso' : 'cursos'} en tu carrito
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Explora nuestros cursos y encuentra el perfecto para ti
                  </p>
                  <Link 
                    to="/courses"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Explorar Cursos
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                              {item.categoria}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg text-white">{item.nombre}</h3>
                          <p className="text-gray-400">Por {item.instructor}</p>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">Cantidad:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-1 bg-gray-600 text-white rounded-md min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-400">Precio unitario: ${item.precio.toFixed(2)}</p>
                          <p className="text-xl font-bold text-green-400">
                            ${(item.precio * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resumen de compra */}
          <div>
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-white mb-6">Resumen de Compra</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Descuentos:</span>
                  <span className="text-green-400">-${descuentos.toFixed(2)}</span>
                </div>
                <hr className="border-gray-600" />
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total:</span>
                  <span className="text-green-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="mb-4 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-200 text-sm mb-3">
                    Debes iniciar sesión para realizar la compra
                  </p>
                  <Link
                    to="/auth/login"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors block text-center"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={handlePurchase}
                  disabled={purchasing || cartItems.length === 0}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors mb-4 flex items-center justify-center gap-2"
                >
                  {purchasing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Finalizar Compra
                    </>
                  )}
                </button>
              )}

              {/* Botón Ver Compras */}
              <Link 
                to="/purchases"
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold transition-colors mb-4 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Ver Compras
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-600">
                <h3 className="font-medium text-white mb-4">Lo que incluye tu compra:</h3>
                <ul className="text-sm text-gray-300 space-y-3">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-400 flex-shrink-0" />
                    Acceso de por vida a los cursos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    Garantía de devolución de 30 días
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-400 flex-shrink-0" />
                    Certificado de finalización
                  </li>
                  <li className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-green-400 flex-shrink-0" />
                    Acceso desde cualquier dispositivo
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
