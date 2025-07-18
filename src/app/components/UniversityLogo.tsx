// components/UniversityLogo.tsx
'use client'

import { useEffect, useState } from 'react'

interface University {
  id: string
  name: string
  shortName: string
  logoUrl: string
  country: string
  hasLogo: boolean
}

// Configuración de universidades con rutas corregidas
const universities: University[] = [
  {
    id: 'UTEC',
    name: 'Universidad de Ingeniería y Tecnología',
    shortName: 'UTEC',
    logoUrl: '/logos/utec-logo.png',
    country: 'Perú',
    hasLogo: true
  },
  {
    id: 'UPC',
    name: 'Universidad Peruana de Ciencias Aplicadas',
    shortName: 'UPC',
    logoUrl: '/logos/upc-logo.png',
    country: 'Perú',
    hasLogo: true
  },
  {
    id: 'PUCP',
    name: 'Pontificia Universidad Católica del Perú',
    shortName: 'PUCP',
    logoUrl: '/logos/pucp-logo.png',
    country: 'Perú',
    hasLogo: true
  },
  {
    id: 'UNI',
    name: 'Universidad Nacional de Ingeniería',
    shortName: 'UNI',
    logoUrl: '/logos/uni-logo.png',
    country: 'Perú',
    hasLogo: true
  },
  {
    id: 'UNMSM',
    name: 'Universidad Nacional Mayor de San Marcos',
    shortName: 'UNMSM',
    logoUrl: '/logos/unmsm-logo.png',
    country: 'Perú',
    hasLogo: true
  },
  {
    id: 'UL',
    name: 'Universidad de Lima',
    shortName: 'UL',
    logoUrl: '/logos/ul-logo.png',
    country: 'Perú',
    hasLogo: false // Cambiado a false ya que no tienes la imagen
  },
  {
    id: 'ULIMA',
    name: 'Universidad Científica del Sur',
    shortName: 'UCSUR',
    logoUrl: '/logos/ucsur-logo.png',
    country: 'Perú',
    hasLogo: false // Cambiado a false ya que no tienes la imagen
  },
  {
    id: 'MIT',
    name: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    logoUrl: '/logos/mit-logo.png',
    country: 'Estados Unidos',
    hasLogo: true
  },
  {
    id: 'STANFORD',
    name: 'Stanford University',
    shortName: 'Stanford',
    logoUrl: '/logos/stanford-logo.png',
    country: 'Estados Unidos',
    hasLogo: true
  },
  {
    id: 'UNAM',
    name: 'Universidad Nacional Autónoma de México',
    shortName: 'UNAM',
    logoUrl: '/logos/unam-logo.png',
    country: 'México',
    hasLogo: false
  }
]

interface UniversityLogoProps {
  className?: string
  showName?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function UniversityLogo({ 
  className = '', 
  showName = false,
  size = 'md'
}: UniversityLogoProps) {
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const getUserUniversity = () => {
      try {
        // Buscar en sessionStorage primero, luego en localStorage
        const userData = sessionStorage.getItem('educloud_user') || localStorage.getItem('educloud_user')
        
        console.log('🔍 Buscando datos de usuario:', userData)
        
        if (userData) {
          const user = JSON.parse(userData)
          console.log('👤 Usuario encontrado:', user)
          
          const university = universities.find(uni => uni.id === user.tenant_id)
          console.log('🏫 Universidad encontrada:', university)
          
          setCurrentUniversity(university || null)
          setImageError(false) // Reset error cuando cambie universidad
        } else {
          console.log('❌ No se encontraron datos de usuario')
          setCurrentUniversity(null)
        }
      } catch (error) {
        console.error('❌ Error al obtener datos del usuario:', error)
        setCurrentUniversity(null)
      }
    }

    // Ejecutar inmediatamente
    getUserUniversity()

    // Event listeners para cambios
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'educloud_user' || e.key === null) {
        console.log('📢 Storage cambió:', e.key)
        getUserUniversity()
      }
    }

    const handleCustomStorageChange = () => {
      console.log('📢 Evento userChanged detectado')
      getUserUniversity()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userChanged', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userChanged', handleCustomStorageChange)
    }
  }, [isClient])

  // Debug logs
  useEffect(() => {
    console.log('🔄 Estado del componente:', {
      isClient,
      currentUniversity,
      imageError
    })
  }, [isClient, currentUniversity, imageError])

  if (!isClient || !currentUniversity) {
    console.log('🚫 No renderizando logo - Usuario no encontrado o no en cliente')
    return null
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const shouldShowImage = currentUniversity.hasLogo && !imageError

  const handleImageError = () => {
    console.log('❌ Error cargando imagen para:', currentUniversity.shortName)
    setImageError(true)
  }

  console.log('🖼️ Renderizando logo:', {
    university: currentUniversity.shortName,
    shouldShowImage,
    imageUrl: currentUniversity.logoUrl
  })

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group">
        <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden shadow-lg hover:shadow-xl hover:shadow-green-400/20`}>
          {shouldShowImage ? (
            <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-inner">
              <img
                src={currentUniversity.logoUrl}
                alt={`Logo ${currentUniversity.shortName}`}
                width={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
                height={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
                className="rounded-full object-contain w-full h-full p-1"
                onError={handleImageError}
                onLoad={() => console.log('✅ Imagen cargada exitosamente:', currentUniversity.shortName)}
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-green-400/40 hover:ring-green-400/70 transition-all duration-300"></div>
            </div>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center text-white font-bold ${textSizeClasses[size]} rounded-full shadow-lg relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-full"></div>
              <span className="relative z-10 drop-shadow-sm">
                {currentUniversity.shortName.slice(0, 2).toUpperCase()}
              </span>
              <div className="absolute inset-0 rounded-full ring-2 ring-green-300/50 hover:ring-green-300/80 transition-all duration-300"></div>
            </div>
          )}
        </div>
        
        {/* Tooltip mejorado */}
        <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white text-xs px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 border border-green-400/30 pointer-events-none shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">{currentUniversity.name}</span>
          </div>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45 border-l border-t border-green-400/30 rounded-tl-sm"></div>
        </div>
      </div>
      
      {showName && (
        <div className="text-white">
          <div className={`font-semibold ${textSizeClasses[size]}`}>
            {currentUniversity.shortName}
          </div>
          <div className="text-gray-400 text-xs">
            {currentUniversity.country}
          </div>
        </div>
      )}
    </div>
  )
}
