import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { supabase } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private router: Router) {}

  async saveUserData(userData: any) {
    console.log('Datos del usuario antes de cifrar:', userData);
  
    if (!userData.favoritos) {
      userData.favoritos = [];
      console.log('Campo favoritos no encontrado. Estableciendo un array vacío.');
    }
  
    const encryptedData = this.encryptData(JSON.stringify(userData));
    await Preferences.set({
      key: 'userData',
      value: encryptedData,
    });
  }  

  async getUserData() {
    const { value } = await Preferences.get({ key: 'userData' });
  
    if (value) {
      try {
        const decryptedData = this.decryptData(value);
        const userData = JSON.parse(decryptedData);
        userData.favoritos = userData.favoritos || [];
        console.log('Datos del usuario:', userData);
        return userData;
      } catch (error) {
        console.error("Error al parsear los datos desencriptados:", error);
        return null;
      }
    }
    return null;
  }

  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, environment.secretKey).toString();
  }

  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, environment.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async isDateExpired(): Promise<boolean> {
    const userData = await this.getUserData();
    if (!userData) {
      console.log("No hay datos de usuario, redirigiendo a /welcome");
      await this.logout();
      return true;
    }
  
    if (userData.role === 'anonymous') {
      console.log('Usuario invitado, no aplicar expiración de sesión');
      return false;
    }
  
    if (userData.expiration && Date.now() < userData.expiration) {
      console.log("Sesión válida: dentro del tiempo de expiración");
      return false;
    }
  
    console.log("Sesión expirada o no hay información de expiración");
    await this.logout();
    return true;
  }
  
  async getDecryptedUserData() {
    const { value } = await Preferences.get({ key: 'userData' });

    if (!value) {
      console.log('No se encontraron datos de usuario');
      return null;
    }

    try {
      const userData = JSON.parse(value);
      console.log('Datos del usuario recuperados:', userData);
      return userData;
    } catch (error) {
      console.error('Error al parsear los datos del usuario:', error);
      return null;
    }
  }

  async logout() {
    console.log('Cerrando sesión y limpiando datos de usuario');
    await Preferences.clear();
    sessionStorage.clear();
    this.router.navigate(['/welcome']);
  }

  async registerUser(user: { username: string; password: string; role: string; email: string; fullName: string; birthDate: string }) {
    const { data: insertedData, error: insertError } = await supabase
      .from('usuarios')
      .insert([
        {
          username: user.username,
          password: user.password,
          role: user.role,
          email: user.email,
          fullName: user.fullName,
          birthDate: user.birthDate,
          favoritos: [],
        },
      ])
      .single();
  
    if (insertError) {
      console.error('Error al registrar usuario:', insertError);
      throw insertError;
    }
  
    console.log('Usuario registrado correctamente:', insertedData);
  
    return insertedData;
  }  

  async updateUserFavorites(userId: number) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('favoritos')
        .eq('id', userId)
        .single();
  
      if (error) {
        console.error('Error al obtener favoritos actualizados:', error);
        return null;
      }
  
      // Actualiza los datos del usuario en Preferences
      const userData = await this.getUserData();
      if (userData) {
        userData.favoritos = data.favoritos;
        await this.saveUserData(userData); // Actualiza localmente
        console.log('Favoritos actualizados localmente:', userData.favoritos);
      }
  
      return data.favoritos;
    } catch (error) {
      console.error('Error al actualizar favoritos del usuario:', error);
      return null;
    }
  }
}  