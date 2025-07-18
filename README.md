# EduCloud - Plataforma Educativa Basada en Microservicios

## Descripción del Proyecto
EduCloud es una plataforma innovadora para la digitalización de servicios educativos, desarrollada como parte de mi portafolio de proyectos. Implementa una arquitectura moderna que permite gestionar cursos online, instructores, estudiantes y transacciones de manera eficiente con búsqueda avanzada mediante Elasticsearch.

## Características Principales
- **Búsqueda Avanzada**: Sistema de búsqueda en tiempo real con Elasticsearch y API Gateway
- **Frontend Moderno**: Interfaz desarrollada con React, TypeScript y Tailwind CSS
- **Arquitectura Escalable**: Diseño preparado para microservicios con APIs RESTful
- **Experiencia de Usuario Optimizada**: Autocompletado, highlighting y navegación por teclado
- **Responsive Design**: Interfaz adaptable a dispositivos móviles y desktop
- **Carrito de Compras**: Sistema de gestión de cursos con persistencia local

## Funcionalidades Implementadas

### Sistema de Búsqueda Inteligente
- **Autocompletado en Tiempo Real**: Sugerencias mientras escribes (debounce de 300ms)
- **Múltiples Algoritmos**: Fulltext, fuzzy, prefix, autocomplete e híbrida
- **Highlighting**: Resaltado de términos encontrados en los resultados
- **Navegación por Teclado**: Soporte completo para ↑↓, Enter y Esc
- **Score de Relevancia**: Algoritmo de Elasticsearch para resultados precisos

### Gestión de Cursos
- **Catálogo Dinámico**: Listado de cursos con filtros y categorías
- **Información Detallada**: Instructor, duración, nivel, precio y calificaciones
- **Estados de Curso**: Activo, borrador, publicado con control de visibilidad
- **Carrito Inteligente**: Prevención de duplicados con feedback visual

### Interfaz de Usuario
- **Diseño Moderno**: Paleta de colores verde y negro con efectos visuales
- **Componentes Reutilizables**: Botones, cards, modales y formularios
- **Animaciones Suaves**: Transiciones y efectos hover para mejor UX
- **Accesibilidad**: Navegación por teclado y etiquetas ARIA

## Arquitectura del Sistema

### Frontend (React + TypeScript)
- **Framework**: React 18 con TypeScript para tipado fuerte
- **Styling**: Tailwind CSS para diseño responsivo
- **Routing**: React Router DOM para navegación SPA
- **Estado**: Context API para gestión global del carrito
- **Build Tool**: Vite para desarrollo y construcción optimizada

### API de Búsqueda Avanzada
- **Endpoint**: AWS API Gateway con Lambda
- **Base URL**: `https://r9ttk3it54.execute-api.us-east-1.amazonaws.com/dev`
- **Motor de Búsqueda**: Elasticsearch con índices por tenant
- **Tipos de Búsqueda**: 
  - `fulltext`: Búsqueda en texto completo
  - `fuzzy`: Tolerancia a errores tipográficos  
  - `prefix`: Autocompletado por prefijo
  - `autocomplete`: Optimizado para velocidad
  - `hibrida`: Combinación de algoritmos

### Infraestructura Cloud
- **Hosting**: Amazon S3 con Static Website Hosting
- **CDN**: CloudFront para distribución global (opcional)
- **APIs**: AWS Lambda + API Gateway
- **Base de Datos**: Elasticsearch para búsquedas
- **Autenticación**: JWT tokens para seguridad

## Tecnologías Utilizadas

### Frontend
- **React 18**: Framework de UI con hooks modernos
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Framework de CSS utilitario
- **Vite**: Build tool de nueva generación
- **Lucide React**: Librería de iconos optimizada

### Herramientas de Desarrollo
- **ESLint**: Linting de código JavaScript/TypeScript
- **PostCSS**: Procesamiento de CSS con Autoprefixer
- **React Hot Toast**: Notificaciones elegantes
- **React Router DOM**: Enrutamiento declarativo

### Despliegue
- **AWS S3**: Hosting de sitios web estáticos
- **GitHub**: Control de versiones y CI/CD
- **NPM**: Gestión de dependencias

## 🚀 Instalación y Desarrollo

### 1. **Clonar el proyecto**
```bash
git clone https://github.com/Ronal-Jesus-Condor-Blas/frontend-fi.git
cd frontend-fi
```

### 2. **Instalar dependencias**
```bash
npm install
```

### 3. **Ejecutar en desarrollo**
```bash
npm run dev
```

### 4. **Construir para producción**
```bash
npm run build
```

### 5. **Vista previa de producción**
```bash
npm run preview
```

## Demo y Acceso

### 🌐 **Aplicación Web**
- **URL de Desarrollo**: http://localhost:3000
- **URL de Producción**: http://frodu.s3-website-us-east-1.amazonaws.com

### 🔍 **API de Búsqueda**
- **Búsqueda Avanzada**: `GET /cursos/buscar-avanzado?q={término}&tipo=autocomplete`
- **Parámetros**: 
  - `q`: Término de búsqueda (requerido)
  - `tipo`: Algoritmo de búsqueda (opcional)
  - `limit`: Número de resultados (default: 10)
  - `from`: Offset para paginación (default: 0)

### 📊 **Ejemplos de Búsqueda**
```bash
# Búsqueda básica
curl "https://r9ttk3it54.execute-api.us-east-1.amazonaws.com/dev/cursos/buscar-avanzado?q=javascript"

# Autocompletado
curl "https://r9ttk3it54.execute-api.us-east-1.amazonaws.com/dev/cursos/buscar-avanzado?q=react&tipo=autocomplete&limit=5"

# Búsqueda fuzzy (tolerante a errores)
curl "https://r9ttk3it54.execute-api.us-east-1.amazonaws.com/dev/cursos/buscar-avanzado?q=javasript&tipo=fuzzy"
```

## Estructura del Proyecto
```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── cart/           # Componentes del carrito
│   │   ├── courses/        # Componentes de cursos
│   │   └── ui/             # Componentes base de UI
│   ├── context/            # Context providers
│   ├── lib/                # Utilidades y APIs
│   ├── types/              # Definiciones de TypeScript
│   └── pages/              # Páginas de la aplicación
├── public/                 # Assets estáticos
└── dist/                   # Build de producción
```

## Logros y Aprendizajes

- **Integración de Elasticsearch**: Implementación exitosa de búsqueda avanzada con múltiples algoritmos
- **UX Optimizada**: Desarrollo de interfaz intuitiva similar a plataformas comerciales (Inkafarma style)
- **Arquitectura Escalable**: Diseño preparado para evolucionar hacia microservicios
- **Performance**: Build optimizado con code splitting y lazy loading
- **Accesibilidad**: Navegación por teclado y estándares WCAG
- **Responsive Design**: Experiencia consistente en todos los dispositivos

## Próximas Mejoras

- **Autenticación Completa**: Sistema de login/registro con JWT
- **Microservicio de Cursos**: API independiente para gestión de cursos
- **Sistema de Pagos**: Integración con Stripe o PayPal
- **Dashboard de Instructor**: Panel para gestión de cursos
- **Analytics**: Seguimiento de búsquedas y conversiones
- **PWA**: Aplicación web progresiva con offline support

## Repositorio
- **GitHub**: https://github.com/Ronal-Jesus-Condor-Blas/frontend-fi

## Contacto
¿Interesado en saber más sobre este proyecto o mis habilidades en desarrollo full-stack?

- **Email**: ronal.condor@utec.edu.pe
- **LinkedIn**: Ronal Jesús Condor Blas
- **GitHub**: Ronal-Jesus-Condor-Blas

---
*Este proyecto fue desarrollado como parte de mi portafolio para demostrar mis habilidades en desarrollo frontend moderno, integración de APIs y experiencia de usuario.*

## 🎯 Funcionalidades
- ✅ Gestión de cursos (crear, editar, eliminar)
- ✅ Búsqueda avanzada con filtros
- ✅ Autenticación de usuarios
- ✅ Diseño responsive
- ✅ Interfaz moderna con Tailwind CSS

## 🔧 Tecnologías utilizadas
- **Frontend**: Next.js 13+ con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Estado**: React Hooks

## 🚀 Características principales
- **Búsqueda inteligente**: Encuentra cursos por nombre, descripción, categoría
- **CRUD completo**: Crear, leer, actualizar y eliminar cursos
- **Autenticación**: Sistema de login/logout
- **Responsive**: Funciona en desktop, tablet y móvil
- **Moderno**: Interfaz limpia y profesional

¡Listo para usar! 🎉

## 👨‍💻 Desarrollado por
**Ronal Jesus Condor Blas**
