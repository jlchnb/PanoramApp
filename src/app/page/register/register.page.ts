import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  user = {
    username: '',
    password: '',
    role: 'user',
  };

  constructor(private router: Router, private authService: AuthServiceService) {}

  async registerUser() {
    try {
        const response = await this.authService.registerUser(this.user);
        console.log('Usuario registrado:', response); 
        sessionStorage.setItem('userkey',JSON.stringify(response));
        if (response) {
            const encryptedData = this.authService.encryptData(JSON.stringify(response)); 
            await Preferences.set({
                key: 'userData',
                value: encryptedData
            });
        }
        this.router.navigate(['/home']);
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
    }
}
}