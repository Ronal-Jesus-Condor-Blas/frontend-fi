// lib/coursesApi.ts
export interface Course {
  curso_id?: string;
  tenant_id?: string;
  curso_datos: {
    nombre?: string;
    descripcion: string;
    precio: number;
    categoria?: string;
    estado?: string;
    instructor?: string;
    duracion_horas?: number;
    fecha_creacion?: string;
    nivel?: string;
    etiquetas?: string[];
    publicado?: boolean;
  };
}

export interface CreateCourseRequest {
  curso_datos: {
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    estado: string;
  };
}

class CoursesApiService {
  private baseUrl = 'https://vojyv84ne9.execute-api.us-east-1.amazonaws.com/dev/cursos';

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('educloud_token') || localStorage.getItem('educloud_token');
  }

  private getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': token })
    };
  }

  // 🟢 PÚBLICO - Listar cursos (no requiere autenticación)
  async listarCursos(): Promise<Course[]> {
    try {
      console.log('🔍 Intentando cargar cursos desde API...');
      
      const headers = this.getAuthHeaders();
      console.log('📡 Headers enviados:', headers);
      
      const response = await fetch(`${this.baseUrl}/listar`, {
        method: 'GET',
        headers
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      const data = await response.json();
      console.log('📦 Datos recibidos:', data);
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        console.error('❌ Error response:', data);
        throw new Error(`Error al cargar cursos: ${response.status}`);
      }
      
      // La API devuelve { cursos: [...] }
      if (data.cursos && Array.isArray(data.cursos)) {
        console.log('✅ Cursos encontrados:', data.cursos.length);
        return data.cursos;
      }
      
      // Si no hay cursos, devolver array vacío
      console.log('⚠️ No se encontraron cursos');
      return [];
    } catch (error) {
      console.error('❌ Error al listar cursos:', error);
      // Si es un error de red o parsing, devolver array vacío en lugar de lanzar error
      if (
        error instanceof TypeError ||
        (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string' && (error as any).message.includes('Failed to fetch'))
      ) {
        throw new Error('Error de conexión. Verifica tu internet e intenta nuevamente.');
      }
      throw error;
    }
  }

  // 🟢 PÚBLICO - Buscar curso por ID (no requiere autenticación)
  async buscarCurso(id: string): Promise<Course | null> {
    try {
      const response = await fetch(`${this.baseUrl}/buscar/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) return null;
        console.error('Error response:', data);
        throw new Error(`Error al buscar curso: ${response.status}`);
      }
      
      if (data.body && typeof data.body === 'string') {
        return JSON.parse(data.body);
      }
      
      return data.curso || data;
    } catch (error) {
      console.error('Error al buscar curso:', error);
      if (
        error instanceof TypeError ||
        (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string' && (error as any).message.includes('Failed to fetch'))
      ) {
        throw new Error('Error de conexión. Verifica tu internet e intenta nuevamente.');
      }
      throw error;
    }
  }

  // 🔒 PROTEGIDO - Crear curso (requiere autenticación)
  async crearCurso(cursoData: CreateCourseRequest): Promise<Course> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    try {
      const response = await fetch(`${this.baseUrl}/crear`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cursoData)
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error('AUTHENTICATION_REQUIRED');
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.body && typeof data.body === 'string') {
        return JSON.parse(data.body);
      }
      
      return data.curso || data;
    } catch (error) {
      console.error('Error al crear curso:', error);
      throw error;
    }
  }

  // 🔒 PROTEGIDO - Modificar curso (requiere autenticación)
  async modificarCurso(id: string, cursoData: Partial<Course>): Promise<Course> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    try {
      const response = await fetch(`${this.baseUrl}/modificar/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ curso_datos: cursoData })
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error('AUTHENTICATION_REQUIRED');
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.body && typeof data.body === 'string') {
        return JSON.parse(data.body);
      }
      
      return data.curso || data;
    } catch (error) {
      console.error('Error al modificar curso:', error);
      throw error;
    }
  }

  // 🔒 PROTEGIDO - Eliminar curso (requiere autenticación)
  async eliminarCurso(id: string): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    try {
      const response = await fetch(`${this.baseUrl}/eliminar/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error('AUTHENTICATION_REQUIRED');
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      throw error;
    }
  }

  // 🔒 PROTEGIDO - Poblar cursos (requiere autenticación)
  async poblarCursos(cantidad: number = 20): Promise<Course[]> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    try {
      const response = await fetch(`${this.baseUrl}/poblar`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ cantidad })
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error('AUTHENTICATION_REQUIRED');
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.body && typeof data.body === 'string') {
        return JSON.parse(data.body);
      }
      
      return data.cursos || data || [];
    } catch (error) {
      console.error('Error al poblar cursos:', error);
      throw error;
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const coursesApi = new CoursesApiService();