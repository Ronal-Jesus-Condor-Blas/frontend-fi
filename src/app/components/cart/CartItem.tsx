'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart()
  const { user, token } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar la compra')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            courseId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          total
        })
      })

      if (!response.ok) {
        throw new Error('Error al procesar la compra')
      }

      toast.success('¡Compra realizada exitosamente!')
      clearCart()
      window.location.href = '/purchases'
    } catch (error) {
      toast.error('Error al procesar la compra')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-8">
            Explora nuestros cursos y encuentra el perfecto para ti
          </p>
          <Button asChild size="lg">
            <Link to="/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Explorar Cursos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link to="/courses">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Seguir Comprando
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Carrito de Compras</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items del carrito */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {itemCount} {itemCount === 1 ? 'curso' : 'cursos'} en tu carrito
              </h2>
              <Button variant="outline" size="sm" onClick={clearCart}>
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar Carrito
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    width={120}
                    height={80}
                    className="rounded object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-600 mb-2">Por {item.instructor}</p>
                    <p className="text-2xl font-bold text-green-600">${item.price}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-3 py-1 bg-gray-100 rounded">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Resumen de compra */}
        <div>
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumen de Compra</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Descuentos:</span>
                <span className="text-green-600">-$0.00</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full mb-4" 
              size="lg"
              onClick={handlePurchase}
              disabled={isProcessing || !user}
            >
              {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
            </Button>

            {!user && (
              <p className="text-sm text-center text-gray-600">
                <Link to="/auth/login" className="text-blue-600 hover:text-blue-500">
                  Inicia sesión
                </Link>{' '}
                para completar tu compra
              </p>
            )}

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-3">Políticas de compra:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Acceso de por vida a los cursos</li>
                <li>• Garantía de devolución de 30 días</li>
                <li>• Certificado de finalización</li>
                <li>• Acceso desde cualquier dispositivo</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
