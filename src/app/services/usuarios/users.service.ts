import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { supabase } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor() { }

  async validar_usuario(usuario: Usuario): Promise<boolean> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('username', usuario.username)
      .eq('password', usuario.password)
      .single();

    if (error) {
      console.error('Error al validar usuario:', error);
      return false;
    }

    return !!data;
  }

  async esAdmin(usuario: Usuario): Promise<boolean> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('username', usuario.username)
      .single();

    if (error) {
      console.error('Error al verificar admin:', error);
      return false;
    }

    return data?.role === 'admin';
  }

  async getUsuario(username: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }

    return data as Usuario;
  }

  async getAlluser(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');
    if (error) {
      console.error('Error al obtener todos los usuarios:', error);
      return [];
    }
    return data as Usuario[];
  }

  async deleteUser(username: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('username', username);
    if (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    } else {
      console.log(`Usuario ${username} eliminado de la base de datos.`);
    }
  }

  async createUser(usuario: Usuario): Promise<any> {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuario]);
    if (error) {
      console.error('Error al crear usuario:', error);
      throw new Error(error.message);
    }
    return data;
  }
}