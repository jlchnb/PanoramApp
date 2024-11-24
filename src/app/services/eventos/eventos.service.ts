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
    
    const eventos = data.map(evento => ({
      ...evento,
      fecha: new Date(evento.fecha)
    }));
  
    return eventos as Evento[];
  }

  async crearEvento(evento: Evento): Promise<void> {
    const eventoTransformado = {
      ...evento,
      fecha: evento.fecha.toISOString().split('T')[0]
    };
  
    const { error } = await supabase
      .from('eventos')
      .insert(eventoTransformado);
  
    if (error) {
      console.error('Error al crear el evento:', error);
    }
  }
}