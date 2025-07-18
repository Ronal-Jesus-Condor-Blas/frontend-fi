'use client'

import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  Code, 
  Palette, 
  TrendingUp, 
  Briefcase, 
  BarChart3, 
  Globe,
  Users,
  BookOpen,
  Star,
  Zap,
  Award
} from 'lucide-react'

export default function CategoriesPage() {
  const categories = [
    {
      id: 'programacion',
      name: 'Programación',
      description: 'Aprende los lenguajes y tecnologías más demandados del mercado',
      courses: 245,
      students: 45000,
      icon: Code,
      color: 'from-green-500 to-green-600',
      hoverColor: 'group-hover:from-green-600 group-hover:to-green-700'
    },
    {
      id: 'diseno',
      name: 'Diseño',
      description: 'UI/UX, diseño gráfico y herramientas creativas profesionales',
      courses: 128,
      students: 22000,
      icon: Palette,
      color: 'from-gray-600 to-gray-700',
      hoverColor: 'group-hover:from-gray-700 group-hover:to-gray-800'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Marketing digital, SEO, redes sociales y estrategias efectivas',
      courses: 89,
      students: 18000,
      icon: TrendingUp,
      color: 'from-green-400 to-green-500',
      hoverColor: 'group-hover:from-green-500 group-hover:to-green-600'
    },
    {
      id: 'negocios',
      name: 'Negocios',
      description: 'Emprendimiento, administración y finanzas para el éxito empresarial',
      courses: 156,
      students: 31000,
      icon: Briefcase,
      color: 'from-gray-700 to-gray-800',
      hoverColor: 'group-hover:from-gray-800 group-hover:to-black'
    },
    {
      id: 'datos',
      name: 'Ciencia de Datos',
      description: 'Análisis de datos, machine learning e inteligencia artificial',
      courses: 67,
      students: 12000,
      icon: BarChart3,
      color: 'from-green-600 to-green-700',
      hoverColor: 'group-hover:from-green-700 group-hover:to-green-800'
    },
    {
      id: 'idiomas',
      name: 'Idiomas',
      description: 'Aprende nuevos idiomas con metodologías modernas y efectivas',
      courses: 34,
      students: 8500,
      icon: Globe,
      color: 'from-gray-500 to-gray-600',
      hoverColor: 'group-hover:from-gray-600 group-hover:to-gray-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Explora por 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> Categorías</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Descubre el área de conocimiento que transformará tu carrera profesional 
              y te llevará al siguiente nivel
            </p>
          </div>
          
          {/* Floating badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-400" />
              Contenido Actualizado
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
              <Award className="h-4 w-4 text-green-400" />
              Certificaciones Oficiales
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
              <Users className="h-4 w-4 text-green-400" />
              Comunidad Activa
            </div>
          </div>
        </div>
      </div>

      {/* Grid de categorías */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link 
                key={category.id} 
                to={`/courses?category=${category.id}`}
                className="group relative"
              >
                <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:rotate-1">
                  {/* Header con gradiente animado */}
                  <div className={`h-40 bg-gradient-to-br ${category.color} ${category.hoverColor} transition-all duration-500 flex items-center justify-center relative overflow-hidden`}>
                    {/* Efecto de brillo animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-16 w-16 text-white drop-shadow-lg" />
                    </div>
                    
                    {/* Partículas decorativas */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-300"></div>
                    <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-700"></div>
                  </div>

                  <div className="p-6 relative">
                    {/* Indicador de número */}
                    <div className="absolute -top-3 left-6 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>

                    <h3 className="font-bold text-2xl text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-300 mb-6 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                      {category.description}
                    </p>

                    {/* Stats mejoradas */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <BookOpen className="h-4 w-4 text-green-400" />
                        <span className="font-medium">{category.courses} cursos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-4 w-4 text-green-400" />
                        <span className="font-medium">{category.students.toLocaleString()} estudiantes</span>
                      </div>
                    </div>

                    {/* Call to action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-sm text-gray-400 ml-2">4.8</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-green-400 font-semibold group-hover:gap-3 transition-all duration-300">
                        <span>Explorar</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Sección de estadísticas mejorada */}
        <div className="mt-20 bg-gray-800 border border-gray-700 rounded-2xl p-8 relative overflow-hidden">
          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Nuestra Plataforma en Números
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold">6</span>
                </div>
                <div className="text-gray-300 font-medium">Categorías Principales</div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold">719</span>
                </div>
                <div className="text-gray-300 font-medium">Cursos Totales</div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold">136K+</span>
                </div>
                <div className="text-gray-300 font-medium">Estudiantes Activos</div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold">95%</span>
                </div>
                <div className="text-gray-300 font-medium">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA mejorado */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-12 max-w-4xl mx-auto relative overflow-hidden">
            {/* Efectos de fondo */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-white mb-6">
                ¿No encuentras tu 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> categoría ideal</span>?
              </h3>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Sugiérenos nuevas categorías o cursos que te gustaría ver en nuestra plataforma. 
                Tu opinión nos ayuda a crecer.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Sugerir Categoría
                </button>
                
                <button className="border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                  Contactar Soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
