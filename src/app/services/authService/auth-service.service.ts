import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }

  async isDateExpired(): Promise<boolean> {
    const userData = await this.getDecryptedUserData();
    if (userData?.expiration && Date.now() < userData.expiration) {
        console.log("Usuario dentro del tiempo de expiración")
        return true; // La sesión es válida si el tiempo actual es menor a la expiración
    }
    console.log("Usuario fuera del tiempo de expiración")
    await this.logout(); // Si ya pasó el tiempo, desloguea
    return false;
  }

  async getDecryptedUserData() {
    const { value } = await Preferences.get({ key: 'userData' });
    if (value) {
      try {
        console.log("try")
        const bytes = CryptoJS.AES.decrypt(value, environment.secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
      } catch (e) {
        console.log(e)
        this.logout();
      }
    }
    return null;
  }

  async logout() {
    await Preferences.remove({ key: 'userData' });
  }
}
