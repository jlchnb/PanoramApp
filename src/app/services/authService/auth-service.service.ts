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

  async saveUserData(userData: any){
    console.log('Datos del usuario antes de cifrar:', userData);
    const encryptedData = this.encryptData(JSON.stringify(userData));
    console.log('Datos cifrados:', encryptedData);
    await Preferences.set({
      key: 'userData',
      value: encryptedData
    });
  }

  async getUserData() {
    const { value } = await Preferences.get({ key: 'userData' });
    if (value) {
        try {
            const decryptedData = this.decryptData(value);
            console.log("Datos desencriptados:", decryptedData);
            return JSON.parse(decryptedData); 
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
    await Preferences.remove({ key: 'userData' });
    sessionStorage.removeItem('loggedUser');
    this.router.navigate(['/welcome']);
  }

  async registerUser(user: { username: string; password: string; role: string }) {
    const hola = await supabase
      .from('usuarios')
      .insert([
        { username: user.username, password: user.password, role: user.role }
      ])
      .single();

      const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('username', user.username)
      .single();
    if (error) {
      throw error;
    }
    console.log("soy la data",data);
    return data;
  }
}