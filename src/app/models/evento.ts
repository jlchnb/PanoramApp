export type CategoriaEvento = 
  'Gratis' | 'Pago' | 'Social' | 'Familiar' | 'Música' | 'Educativo' | 'Deporte' | 'Espectáculo';

export interface GPSCoordinates {
  lat: number;
  lng: number;
}

export interface Evento {
  id: string;
  nombre: string;
  fecha: Date;
  ubicacion: string;
  categorias: CategoriaEvento[];
  imagen: string;
  precio?: number;
  lat: number;
  lng: number;
  horainicio: string;
}