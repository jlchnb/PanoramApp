export interface Usuario {
    username?: string; // Solo para usuarios registrados
    password?: string; // Solo para usuarios registrados
    role: 'admin' | 'user' | 'anonymous'; // Usuario anónimo sin credenciales
    isVerified?: boolean; // Solo para usuarios que han pasado verificación
  }