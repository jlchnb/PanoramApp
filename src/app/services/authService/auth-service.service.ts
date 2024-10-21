import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private router: Router) {}

  async isDateExpired(): Promise<boolean> {
    const userData = await this.getDecryptedUserData();
  
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
}