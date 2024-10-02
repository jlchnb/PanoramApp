import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario'; // Asegúrate de que tu modelo esté correctamente definido
import { supabase } from '../supabase/supabase.service'; // Verifica que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  async validar_usuario(usuario: Usuario): Promise<boolean> {
    const { data, error } = await supabase
      .from('usuarios') // Asegúrate de que esta sea la tabla correcta
      .select('*')
      .eq('username', usuario.username)
      .eq('password', usuario.password)
      .single(); // Devuelve un solo registro

    if (error) {
      console.error('Error al validar usuario:', error);
      return false;
    }

    return !!data; // Retorna true si el usuario existe
  }

  async esAdmin(usuario: Usuario): Promise<boolean> {
    const { data, error } = await supabase
      .from('usuarios') // Asegúrate de que esta sea la tabla correcta
      .select('*')
      .eq('username', usuario.username)
      .single(); // Devuelve un solo registro

    if (error) {
      console.error('Error al verificar admin:', error);
      return false;
    }

    return data?.role === 'admin'; // Retorna true si es admin
  }

  async getUsuario(username: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios') // Asegúrate de que esta sea la tabla correcta
      .select('*')
      .eq('username', username)
      .single(); // Devuelve un solo registro

    if (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }

    return data as Usuario; // Devuelve el usuario encontrado
  }

  async getAlluser(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios') // Asegúrate de que esta sea la tabla correcta
      .select('*');

    if (error) {
      console.error('Error al obtener todos los usuarios:', error);
      return [];
    }

    return data as Usuario[]; // Devuelve todos los usuarios
  }
}