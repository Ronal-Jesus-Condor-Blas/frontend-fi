// components/Footer.tsx
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { name: 'Sobre Nosotros', href: '/about' },
      { name: 'Cómo Funciona', href: '/how-it-works' },
      { name: 'Precios', href: '/pricing' },
      { name: 'Blog', href: '/blog' },
    ],
    courses: [
      { name: 'Programación', href: '/courses?category=programacion' },
      { name: 'Diseño', href: '/courses?category=diseno' },
      { name: 'Marketing', href: '/courses?category=marketing' },
      { name: 'Negocios', href: '/courses?category=negocios' },
    ],
    instructors: [
      { name: 'Conviértete en Instructor', href: '/teach' },
      { name: 'Recursos para Instructores', href: '/instructor-resources' },
      { name: 'Centro de Ayuda', href: '/help' },
      { name: 'Política de Calidad', href: '/quality-policy' },
    ],
    support: [
      { name: 'Centro de Soporte', href: '/support' },
      { name: 'Preguntas Frecuentes', href: '/faq' },
      { name: 'Contacto', href: '/contact' },
      { name: 'Estado del Sistema', href: '/status' },
    ],
    legal: [
      { name: 'Términos de Uso', href: '/terms' },
      { name: 'Política de Privacidad', href: '/privacy' },
      { name: 'Política de Cookies', href: '/cookies' },
      { name: 'Política de Reembolso', href: '/refund-policy' },
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ]

  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Mantente actualizado con los mejores cursos
            </h2>
            <p className="text-gray-300 mb-8">
              Suscríbete a nuestro boletín y recibe las últimas novedades, ofertas exclusivas y contenido educativo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button className="px-6 py-3 bg-green-400 hover:bg-green-300 text-black rounded-lg font-semibold transition-colors">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold">EduCloud</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              La plataforma líder en educación online. Aprende nuevas habilidades, 
              avanza en tu carrera y descubre tu potencial con cursos de alta calidad 
              impartidos por expertos de la industria.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-5 w-5 text-green-400" />
                <span>contacto@educloud.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-5 w-5 text-green-400" />
                <span>+51 (01) 234-5678</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-5 w-5 text-green-400" />
                <span>Lima, Perú</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Plataforma</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Categorías</h3>
            <ul className="space-y-3">
              {footerLinks.courses.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructors Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Instructores</h3>
            <ul className="space-y-3">
              {footerLinks.instructors.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Soporte</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} EduCloud. Todos los derechos reservados.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-400 hover:text-green-400 text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    to={social.href}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
