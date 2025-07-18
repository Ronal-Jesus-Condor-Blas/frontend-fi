// src/pages/Home.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, Users, Search, X, Loader2 } from 'lucide-react';

// Interfaces
interface Curso {
  curso_id: string;
  nombre: string;
  descripcion: string;
  nivel: string;
  precio: number;
  instructor: string;
  categoria: string;
  estado: string;
  score: number;
  highlight?: any;
  snippet?: string;
}

interface SearchResponse {
  total: number;
  cursos: Curso[];
  tipo_busqueda: string;
  tiempo_respuesta: number;
  tenant_usado: string;
  stage: string;
  es_autocompletado: boolean;
  indice_usado?: string; // Añadido para evitar error de propiedad faltante
}

// Componente SearchSection simplificado
const SearchSection: React.FC = () => {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Función de búsqueda simplificada
  const buscarCompleto = () => {
    if (!query.trim()) return

    setIsLoading(true)
    
    // Redirigir a la página de cursos con el término de búsqueda
    setTimeout(() => {
      window.location.href = `/courses?search=${encodeURIComponent(query)}`
    }, 500)
  }

  // Limpiar búsqueda
  const limpiarBusqueda = () => {
    setQuery('')
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-black via-green-400/80 to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">
            ¿Qué quieres aprender hoy?
          </h2>
          
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cursos, instructores, categorías..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && buscarCompleto()}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent pr-32 sm:pr-36"
              />
              
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {query && (
                  <button
                    onClick={limpiarBusqueda}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={buscarCompleto}
                  disabled={isLoading || !query.trim()}
                  className="bg-green-400 text-black px-3 sm:px-6 py-2 rounded-lg font-semibold hover:bg-green-300 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
};

// Componente principal Home
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-400/20 via-green-500/10 to-black relative overflow-hidden">
        {/* Efectos de fondo animados - Solo verdes */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-72 h-72 sm:w-96 sm:h-96 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 sm:w-80 sm:h-80 bg-green-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-green-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-10 left-1/2 w-56 h-56 sm:w-72 sm:h-72 bg-green-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Líneas decorativas */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>

        <div className="container mx-auto px-4 py-16 sm:py-24 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 transform hover:scale-105 transition-all duration-500">
              <span className="inline-block">Aprende sin límites con</span>{' '}
              <span className="text-white relative inline-block group">
                EduCloud
                {/* Glow effect para el título */}
                <div className="absolute inset-0 text-white blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                  EduCloud
                </div>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-4xl mx-auto text-white/90 leading-relaxed transform hover:text-white transition-colors duration-300 px-4">
              Descubre miles de cursos online impartidos por expertos. 
              Desarrolla nuevas habilidades a tu ritmo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
              {/* Botón Explorar Cursos */}
              <div className="relative group">
                <Link 
                  to="/courses"
                  className="bg-green-400 text-black px-6 sm:px-10 py-3 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold hover:bg-green-300 transition-all duration-300 inline-block transform group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-green-400/50 w-full sm:w-auto text-center"
                >
                  Explorar Cursos
                </Link>
                {/* Glow effect para botón verde */}
                <div className="absolute inset-0 bg-green-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
              </div>

              {/* Botón Comenzar Gratis */}
              <div className="relative group">
                <Link 
                  to="/auth/register"
                  className="border-2 border-green-400 text-green-400 px-6 sm:px-10 py-3 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold hover:bg-green-400 hover:text-black transition-all duration-300 inline-block transform group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-green-400/30 w-full sm:w-auto text-center"
                >
                  Comenzar Gratis
                </Link>
                {/* Glow effect para botón outline */}
                <div className="absolute inset-0 border-2 border-green-400 rounded-2xl blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section - NUEVA CON ELASTICSEARCH */}
      <SearchSection />

      {/* Featured Courses Section */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-white">
            Cursos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Course Card 1 */}
            <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105">
              <div className="h-40 sm:h-48 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-semibold">💻 React Avanzado</span>
              </div>
              <div className="p-4 sm:p-6">
                <span className="inline-block bg-green-400 text-black text-xs px-2 py-1 rounded mb-3 font-semibold">
                  Programación
                </span>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-white">
                  React Avanzado con TypeScript
                </h3>
                <p className="text-gray-300 mb-3 text-sm sm:text-base">Por Juan Pérez</p>
                <div className="flex flex-col sm:flex-row sm:items-center mb-3 text-xs sm:text-sm text-gray-400 gap-1 sm:gap-4">
                  <span>⭐ 4.8 (1,250 estudiantes)</span>
                  <span>8 horas</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-green-400">$89.99</span>
                    <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">$129.99</span>
                  </div>
                  <Link 
                    to="/cart"
                    className="bg-green-400 text-black px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-green-300 transition-colors text-sm sm:text-base"
                  >
                    Agregar
                  </Link>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105">
              <div className="h-40 sm:h-48 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-semibold">🎨 UI/UX Design</span>
              </div>
              <div className="p-4 sm:p-6">
                <span className="inline-block bg-purple-400 text-white text-xs px-2 py-1 rounded mb-3 font-semibold">
                  Diseño
                </span>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-white">
                  Diseño UI/UX Moderno
                </h3>
                <p className="text-gray-300 mb-3 text-sm sm:text-base">Por Carlos Ruiz</p>
                <div className="flex flex-col sm:flex-row sm:items-center mb-3 text-xs sm:text-sm text-gray-400 gap-1 sm:gap-4">
                  <span>⭐ 4.7 (650 estudiantes)</span>
                  <span>12 horas</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-green-400">$79.99</span>
                    <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">$99.99</span>
                  </div>
                  <Link 
                    to="/cart"
                    className="bg-green-400 text-black px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-green-300 transition-colors text-sm sm:text-base"
                  >
                    Agregar
                  </Link>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 md:col-span-2 lg:col-span-1">
              <div className="h-40 sm:h-48 bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white text-base sm:text-lg font-semibold">📈 Marketing Digital</span>
              </div>
              <div className="p-4 sm:p-6">
                <span className="inline-block bg-orange-400 text-black text-xs px-2 py-1 rounded mb-3 font-semibold">
                  Marketing
                </span>
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-white">
                  Marketing Digital Estratégico
                </h3>
                <p className="text-gray-300 mb-3 text-sm sm:text-base">Por Ana López</p>
                <div className="flex flex-col sm:flex-row sm:items-center mb-3 text-xs sm:text-sm text-gray-400 gap-1 sm:gap-4">
                  <span>⭐ 4.5 (1,100 estudiantes)</span>
                  <span>6 horas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-green-400">$69.99</span>
                  <Link 
                    to="/cart"
                    className="bg-green-400 text-black px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-green-300 transition-colors text-sm sm:text-base"
                  >
                    Agregar
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Ver más cursos */}
          <div className="text-center mt-6 sm:mt-8">
            <Link 
              to="/courses"
              className="inline-block border border-green-400 text-green-400 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition-colors text-sm sm:text-base"
            >
              Ver Todos los Cursos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-green-400/20 via-green-500/10 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16 text-white">
            ¿Por qué elegir <span className="text-green-400">EduCloud</span>?
          </h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
              {/* Primera columna */}
              <div className="text-center group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Award className="w-16 h-16 sm:w-20 sm:h-20 text-black" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">Certificados Reconocidos</h3>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">Obtén certificados reconocidos por la industria al completar tus cursos.</p>
              </div>

              {/* Segunda columna */}
              <div className="text-center group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Clock className="w-16 h-16 sm:w-20 sm:h-20 text-black" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">Aprende a tu Ritmo</h3>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">Acceso de por vida a los cursos. Aprende cuando quieras, donde quieras.</p>
              </div>

              {/* Tercera columna */}
              <div className="text-center group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Users className="w-16 h-16 sm:w-20 sm:h-20 text-black" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">Comunidad Activa</h3>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">Únete a una comunidad de estudiantes y expertos que te apoyarán en tu aprendizaje.</p>
              </div>
            </div>

            {/* Separadores verticales - Solo en desktop */}
            <div className="hidden lg:block absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-64 sm:h-80 bg-gradient-to-b from-transparent via-gray-400/50 to-transparent"></div>
            <div className="hidden lg:block absolute right-1/3 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-px h-64 sm:h-80 bg-gradient-to-b from-transparent via-gray-400/50 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-black relative overflow-hidden">
        {/* Efectos de fondo animados */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>

        {/* Líneas decorativas */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {/* Estadística 1 */}
            <div className="text-center group">
              <div className="relative">
                <div className="text-2xl sm:text-4xl lg:text-6xl font-bold text-green-400 mb-2 sm:mb-3 transform group-hover:scale-110 transition-all duration-300 group-hover:text-green-300">
                  10,000+
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 text-2xl sm:text-4xl lg:text-6xl font-bold text-green-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                  10,000+
                </div>
              </div>
              <div className="text-gray-300 text-sm sm:text-base lg:text-lg group-hover:text-white transition-colors duration-300">
                Cursos Disponibles
              </div>
            </div>

            {/* Estadística 2 */}
            <div className="text-center group">
              <div className="relative">
                <div className="text-2xl sm:text-4xl lg:text-6xl font-bold text-green-400 mb-2 sm:mb-3 transform group-hover:scale-110 transition-all duration-300 group-hover:text-green-300">
                  50,000+
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 text-2xl sm:text-4xl lg:text-6xl font-bold text-green-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                  50,000+
                </div>
              </div>
              <div className="text-gray-300 text-sm sm:text-base lg:text-lg group-hover:text-white transition-colors duration-300">
                Estudiantes Activos
              </div>
            </div>

            {/* Estadística 3 */}
            <div className="text-center group">
              <div className="relative">
                <div className="text-2xl sm:text-4xl lg:text-6xl font-bold text-green-400 mb-2 sm:mb-3 transform group-hover:scale-110 transition-all duration-300 group-hover:text-green-300">
                  1,000+
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 text-2xl sm:text-4xl lg:text-6xl font-bold text-green-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                  1,000+
                </div>
              </div>
              <div className="text-gray-300 text-sm sm:text-base lg:text-lg group-hover:text-white transition-colors duration-300">
                Instructores Expertos
              </div>
            </div>

            {/* Estadística 4 */}
            <div className="text-center group">
              <div className="relative">
                <div className="text-2xl sm:text-4xl lg:text-6xl font-bold text-green-400 mb-2 sm:mb-3 transform group-hover:scale-110 transition-all duration-300 group-hover:text-green-300">
                  95%
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 text-2xl sm:text-4xl lg:text-6xl font-bold text-green-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                  95%
                </div>
              </div>
              <div className="text-gray-300 text-sm sm:text-base lg:text-lg group-hover:text-white transition-colors duration-300">
                Satisfacción
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-black via-green-400/80 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black transform hover:scale-105 transition-transform duration-300">
              ¿Listo para transformar tu carrera?
            </h2>
            <p className="text-base sm:text-xl lg:text-2xl mb-8 sm:mb-12 text-black/80 leading-relaxed px-4">
              Únete a miles de estudiantes que ya están aprendiendo con nosotros
            </p>
            <div className="relative inline-block group">
              <Link 
                to="/auth/register"
                className="bg-black text-white px-6 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl font-bold hover:bg-gray-900 transition-all duration-300 inline-block transform group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-black/50"
              >
                Empezar Ahora - Es Gratis
              </Link>
              {/* Glow effect para el botón */}
              <div className="absolute inset-0 bg-black rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}