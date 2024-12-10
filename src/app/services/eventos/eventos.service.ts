import { Injectable } from '@angular/core';
import { Evento } from 'src/app/models/Evento';
import { supabase } from '../supabase/supabase.service';
import { AuthServiceService } from '../authService/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(private authService: AuthServiceService) { }

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
      fecha: new Date(`${evento.fecha}T00:00:00`),
      lat: evento.lat,
      lng: evento.lng,
      horainicio: evento.horainicio,
    }));
  
    return eventos as Evento[];
  }
  
  async obtenerUsuarioLogueado() {
    const userData = await this.authService.getUserData();
    if (!userData) {
      console.error('No hay usuario logueado.');
      return null;
    }
    console.log('Usuario logueado:', userData);
    return userData;
  }

  async crearEvento(evento: Evento): Promise<void> {
    const { id, ...eventoSinId } = evento;
  
    const eventoTransformado = {
      ...eventoSinId,
      fecha: evento.fecha.toISOString().split('T')[0],
      horainicio: evento.horainicio,
    };
  
    const { error } = await supabase
      .from('eventos')
      .insert(eventoTransformado);
  
    if (error) {
      console.error('Error al crear el evento:', error);
    }
  }

  async actualizarEvento(evento: Evento): Promise<void> {
    const eventoTransformado = {
      ...evento,
      fecha: evento.fecha.toISOString().split('T')[0],
      horainicio: evento.horainicio
    };
  
    const { error } = await supabase
      .from('eventos')
      .update(eventoTransformado)
      .eq('id', evento.id);
  
    if (error) {
      console.error('Error al actualizar el evento:', error);
    }
  }

  async eliminarEvento(id: string): Promise<void> {
    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error('Error al eliminar el evento:', error);
    }
  }
}