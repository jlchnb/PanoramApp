import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { supabase } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor() {}

  async validar_usuario(usuario: Usuario): Promise<boolean> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('username', usuario.username)
      .eq('password', usuario.password);
  
    if (error) {
      console.error('Error al validar usuario:', error);
      return false;
    }
  
    return data?.length === 1;
  }  

  async esAdmin(usuario: Usuario): Promise<boolean> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('role')
      .eq('username', usuario.username);
  
    if (error) {
      console.error('Error al verificar admin:', error);
      return false;
    }
  
    if (!data || data.length === 0) {
      console.warn('Usuario no encontrado o no es admin.');
      return false;
    }
  
    return data[0].role === 'admin';
  }  

  async getUsuario(username: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, username, password, email, fullName, favoritos, role, birthDate')
      .eq('username', username);
  
    if (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  
    if (!data || data.length === 0) {
      console.warn('Usuario no encontrado.');
      return null;
    }
  
    return data[0] as Usuario;
  }  

  async getAllUsers(): Promise<Usuario[]> {
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
    const { username, password, role, email, fullName, birthDate } = usuario;
    const newUser = {
      username,
      password,
      role,
      email,
      fullName,
      birthDate
    };

    const { data, error } = await supabase
      .from('usuarios')
      .insert([newUser]);

    if (error) {
      console.error('Error al crear usuario:', error);
      throw new Error(error.message);
    }

    return data;
  }

  async updateUser(usuario: Usuario): Promise<Usuario | null> {
    if (!usuario.id) {
      throw new Error('ID del usuario requerido para actualizar datos.');
    }
  
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        email: usuario.email,
        fullName: usuario.fullName,
        birthDate: usuario.birthDate,
      })
      .eq('id', usuario.id);
  
    if (error) {
      console.error('Error al actualizar usuario:', error);
      throw new Error(error.message);
    }
  
    return data ? data[0] as Usuario : null;
  }
  

  async addToFavorites(usuario: Usuario, eventoId: string): Promise<Usuario> {
    if (!usuario.id) {
      throw new Error('ID del usuario requerido para actualizar favoritos.');
    }
    
    const { data: existingUser, error: fetchError } = await supabase
      .from('usuarios')
      .select('favoritos')
      .eq('id', usuario.id)
      .single();
  
    if (fetchError || !existingUser) {
      throw new Error('Usuario no encontrado o error al obtener datos.');
    }
  
    const favoritos = existingUser.favoritos || [];
    if (!favoritos.includes(eventoId)) {
      favoritos.push(eventoId);
    }
  
    const { data, error } = await supabase
      .from('usuarios')
      .update({ favoritos })
      .eq('id', usuario.id);
  
    if (error) {
      console.error('Error al agregar a favoritos:', error);
      throw new Error(error.message);
    }
  
    return { ...usuario, favoritos } as Usuario;
  }  

  async removeFromFavorites(usuario: Usuario, eventoId: string): Promise<Usuario> {
    if (!usuario.id) {
      throw new Error('ID del usuario requerido para actualizar favoritos.');
    }
  
    const { data: existingUser, error: fetchError } = await supabase
      .from('usuarios')
      .select('favoritos')
      .eq('id', usuario.id)
      .single();
  
    if (fetchError || !existingUser) {
      throw new Error('Usuario no encontrado o error al obtener datos.');
    }
  
    const favoritos = existingUser.favoritos?.filter((id: string) => id !== eventoId) || [];
  
    const { data, error } = await supabase
      .from('usuarios')
      .update({ favoritos })
      .eq('id', usuario.id);
  
    if (error) {
      console.error('Error al eliminar de favoritos:', error);
      throw new Error(error.message);
    }
  
    return { ...usuario, favoritos } as Usuario;
  }  
}