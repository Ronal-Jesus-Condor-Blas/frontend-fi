'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface CartItem {
  id: string
  title: string
  instructor: string
  price: number
  thumbnail: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (course: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (courseId: string) => void
  updateQuantity: (courseId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Guardar carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (course: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === course.id)
      
      if (existingItem) {
        toast.error('Este curso ya está en tu carrito')
        return prev
      }
      
      toast.success('Curso agregado al carrito')
      return [...prev, { ...course, quantity: 1 }]
    })
  }

  const removeFromCart = (courseId: string) => {
    setItems(prev => prev.filter(item => item.id !== courseId))
    toast.success('Curso eliminado del carrito')
  }

  const updateQuantity = (courseId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(courseId)
      return
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === courseId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    toast.success('Carrito vaciado')
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
