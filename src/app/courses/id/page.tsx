import { useParams } from 'react-router-dom'

export default function CourseDetail() {
  const { id } = useParams()
  
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6">Detalles del Curso</h1>
        <p className="text-xl">Curso ID: {id}</p>
        <p className="text-gray-400 mt-4">Página en desarrollo...</p>
      </div>
    </div>
  )
}
