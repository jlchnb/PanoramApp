export type CategoriaEvento = 'Gratis' | 'Pago' | 'Social' | 'Familiar' | 'Música' | 'Educativo' | 'Deporte' | 'Espectáculo';
export interface Evento {
  id: number;
  nombre: string;
  fecha: Date;
  ubicacion: string;
  categorias: CategoriaEvento[];
  imagen: string;
}