import { Injectable } from '@angular/core';
import { Evento } from 'src/app/models/Evento';
import { supabase } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor() { }

  async obtenerEventos(): Promise<Evento[]> {
    const { data, error } = await supabase
      .from('eventos')
      .select('*');

    if (error) {
      console.error('Error al obtener eventos:', error);
      return [];
    }
    
    return data as Evento[];
  }

  async crearEvento(evento: Evento): Promise<void> {
    const { error } = await supabase
      .from('eventos')
      .insert(evento);

    if (error) {
      console.error('Error al crear el evento:', error);
    }
  }
}