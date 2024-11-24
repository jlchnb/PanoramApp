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

  async updateUser(usuario: Usuario) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        email: usuario.email,
        fullName: usuario.fullName,
        birthDate: usuario.birthDate,
      })
      .eq('username', usuario.username);
  
    if (error) throw new Error(error.message);
    return data;
  }

  async addToFavorites(usuario: Usuario, eventoId: number): Promise<Usuario> {
    if (!usuario.favoritos) {
      usuario.favoritos = [];
    }
  
    // Verificar si el evento ya está en favoritos
    if (!usuario.favoritos.includes(eventoId)) {
      usuario.favoritos.push(eventoId); // Agregar a favoritos
    }
  
    // Actualizar el usuario en la base de datos
    const { data, error } = await supabase
      .from('usuarios')
      .update({ favoritos: usuario.favoritos })
      .eq('id', usuario.id)
      .select(); // Asegura que siempre haya datos retornados
  
    if (error) {
      console.error('Error al agregar a favoritos:', error);
      throw new Error(error.message);
    }
  
    // Validar que `data` sea un array de usuarios
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as Usuario; // Retornar el usuario actualizado
    }
  
    throw new Error('No se pudo procesar la solicitud. Respuesta inesperada.');
  }

  // Función para eliminar un evento de favoritos
  async removeFromFavorites(usuario: Usuario, eventoId: number): Promise<Usuario> {
    if (!usuario.favoritos) {
      usuario.favoritos = [];
    }
  
    // Filtrar el evento del arreglo de favoritos
    usuario.favoritos = usuario.favoritos.filter(id => id !== eventoId);
  
    // Actualizar el usuario en la base de datos
    const { data, error } = await supabase
      .from('usuarios')
      .update({ favoritos: usuario.favoritos })
      .eq('id', usuario.id)
      .select(); // Asegura que siempre haya datos retornados
  
    if (error) {
      console.error('Error al eliminar de favoritos:', error);
      throw new Error(error.message);
    }
  
    // Validar que `data` sea un array de usuarios
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as Usuario; // Retornar el usuario actualizado
    }
  
    throw new Error('No se pudo procesar la solicitud. Respuesta inesperada.');
  }
}