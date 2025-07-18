'use client'

import { Link } from 'react-router-dom'
import { 
  Star, 
  BookOpen, 
  Users, 
  Award, 
  Calendar,
  ChevronRight,
  Heart,
  MessageCircle,
  PlayCircle,
  TrendingUp,
  Code,
  Palette,
  BarChart3,
  Briefcase,
  Zap,
  CheckCircle,
  UserPlus
} from 'lucide-react'

export default function InstructorsPage() {
  const instructors = [
    {
      id: '1',
      name: 'Juan Pérez',
      speciality: 'Desarrollo Frontend',
      courses: 12,
      students: 15420,
      rating: 4.9,
      experience: '8 años',
      image: '👨‍💻',
      icon: Code,
      specialityColor: 'from-green-500 to-green-600',
      completionRate: 94,
      responseTime: '2 horas',
      featured: true
    },
    {
      id: '2',
      name: 'María González',
      speciality: 'Backend & DevOps',
      courses: 8,
      students: 9830,
      rating: 4.8,
      experience: '6 años',
      image: '👩‍💻',
      icon: BarChart3,
      specialityColor: 'from-gray-600 to-gray-700',
      completionRate: 91,
      responseTime: '1 hora',
      featured: false
    },
    {
      id: '3',
      name: 'Carlos Ruiz',
      speciality: 'UI/UX Design',
      courses: 15,
      students: 12050,
      rating: 4.7,
      experience: '10 años',
      image: '🎨',
      icon: Palette,
      specialityColor: 'from-green-400 to-green-500',
      completionRate: 89,
      responseTime: '3 horas',
      featured: true
    },
    {
      id: '4',
      name: 'Ana López',
      speciality: 'Marketing Digital',
      courses: 10,
      students: 8640,
      rating: 4.6,
      experience: '5 años',
      image: '📈',
      icon: TrendingUp,
      specialityColor: 'from-gray-500 to-gray-600',
      completionRate: 87,
      responseTime: '4 horas',
      featured: false
    },
    {
      id: '5',
      name: 'Roberto Silva',
      speciality: 'Data Science',
      courses: 14,
      students: 11200,
      rating: 4.9,
      experience: '7 años',
      image: '📊',
      icon: BarChart3,
      specialityColor: 'from-green-600 to-green-700',
      completionRate: 96,
      responseTime: '1 hora',
      featured: true
    },
    {
      id: '6',
      name: 'Laura Martín',
      speciality: 'Finanzas & Negocios',
      courses: 9,
      students: 7350,
      rating: 4.8,
      experience: '9 años',
      image: '💼',
      icon: Briefcase,
      specialityColor: 'from-gray-700 to-gray-800',
      completionRate: 93,
      responseTime: '2 horas',
      featured: false
    }
  ]

  const topStats = [
    { label: 'Instructores Expertos', value: '50+', icon: Award },
    { label: 'Años de Experiencia', value: '200+', icon: Calendar },
    { label: 'Estudiantes Impactados', value: '100K+', icon: Users },
    { label: 'Cursos Creados', value: '500+', icon: BookOpen }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Instructores Verificados
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Aprende con los
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> Mejores</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Profesionales de la industria que han transformado miles de carreras 
              con su experiencia y metodologías probadas
            </p>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {topStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center group hover:border-green-500/50 transition-all duration-300">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor) => {
            const IconComponent = instructor.icon
            return (
              <div key={instructor.id} className="group relative">
                {/* Featured Badge */}
                {instructor.featured && (
                  <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Top Instructor
                  </div>
                )}

                <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105">
                  {/* Header con gradiente */}
                  <div className={`h-20 bg-gradient-to-r ${instructor.specialityColor} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Avatar posicionado */}
                    <div className="absolute -bottom-8 left-6">
                      <div className="w-16 h-16 bg-gray-700 border-4 border-gray-800 rounded-full flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300">
                        {instructor.image}
                      </div>
                    </div>

                    {/* Icon de especialidad */}
                    <div className="absolute top-4 right-4">
                      <IconComponent className="h-6 w-6 text-white/80" />
                    </div>
                  </div>

                  <div className="p-6 pt-12">
                    {/* Información del instructor */}
                    <div className="mb-6">
                      <h3 className="font-bold text-xl text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                        {instructor.name}
                      </h3>
                      <p className="text-green-400 font-semibold mb-3">{instructor.speciality}</p>
                      
                      {/* Rating prominente */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-white font-semibold">{instructor.rating}</span>
                        <span className="text-gray-400 text-sm">({instructor.students.toLocaleString()} estudiantes)</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <BookOpen className="h-4 w-4 text-green-400 mx-auto mb-1" />
                        <div className="text-white font-semibold">{instructor.courses}</div>
                        <div className="text-xs text-gray-400">Cursos</div>
                      </div>
                      
                      <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <Users className="h-4 w-4 text-green-400 mx-auto mb-1" />
                        <div className="text-white font-semibold">{instructor.students.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Estudiantes</div>
                      </div>
                    </div>

                    {/* Métricas adicionales */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Experiencia:</span>
                        <span className="text-white font-medium">{instructor.experience}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Tasa de finalización:</span>
                        <span className="text-green-400 font-medium">{instructor.completionRate}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Tiempo de respuesta:</span>
                        <span className="text-white font-medium">{instructor.responseTime}</span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3">
                      <Link 
                        to={`/courses?instructor=${instructor.name}`}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Ver Cursos
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 border border-gray-600 text-gray-300 hover:text-white hover:border-green-500 py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                          <Heart className="h-4 w-4" />
                          Seguir
                        </button>
                        
                        <button className="flex-1 border border-gray-600 text-gray-300 hover:text-white hover:border-green-500 py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Mensaje
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section Mejorada */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-12 relative overflow-hidden">
            {/* Efectos de fondo */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
            
            {/* Elementos decorativos */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-green-500/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-6 left-6 w-16 h-16 bg-green-400/10 rounded-full blur-lg"></div>
            
            <div className="relative z-10 text-center">
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="h-8 w-8 text-green-400" />
              </div>
              
              <h3 className="text-4xl font-bold text-white mb-6">
                ¿Listo para
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> enseñar</span>?
              </h3>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Únete a nuestra comunidad de instructores expertos y comparte tu conocimiento 
                con miles de estudiantes alrededor del mundo. Te acompañamos en cada paso.
              </p>
              
              {/* Beneficios */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="flex items-center gap-3 justify-center">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Ingresos pasivos</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Soporte completo</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Alcance global</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Aplicar como Instructor
                </button>
                
                <button className="border border-gray-600 text-gray-300 hover:text-white hover:border-green-500 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                  Conoce los Requisitos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
