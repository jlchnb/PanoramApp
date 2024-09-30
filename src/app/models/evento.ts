export type CategoriaEvento = 
  'Gratis' | 'Pago' | 'Social' | 'Familiar' | 'Música' | 'Educativo' | 'Deporte' | 'Espectáculo';

export interface GPSCoordinates {
  lat: number;
  lng: number;
}

export interface Evento {
  id: number;
  nombre: string;
  fecha: Date;
  ubicacion: string;
  categorias: CategoriaEvento[];
  imagen: string;
  precio?: number; // Campo opcional si es pagado
  isValidado: boolean; // Si el evento ha sido validado por un administrador
  gps?: GPSCoordinates; // Coordenadas opcionales para eventos con caminatas
  radio?: number; // Radio del área del evento en metros
  duracionHoras?: number; // Duración del evento en horas
}