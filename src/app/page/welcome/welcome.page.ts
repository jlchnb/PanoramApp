import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() { }

  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      cssClass: 'login-modal',
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const { userInfo, redirectTo } = result.data;
        if (redirectTo) {
          this.router.navigate([redirectTo], {
            state: {
              userInfo: userInfo,
            }
          });
        }
      }
    });
  
    return await modal.present();
  }

  async continueAsGuest() {
    const invitado = {
      username: 'Invitado',
      role: 'anonymous',
      favoritos: [],
    };
  
    await Preferences.clear();
    sessionStorage.clear();
  
    await Preferences.set({
      key: 'userkey',
      value: JSON.stringify(invitado),
    });
  
    const storedUserData = sessionStorage.getItem('userkey');
    console.log('Datos guardados en sessionStorage como invitado:', storedUserData);
  
    this.router.navigate(['/home']);
  }
  

  goToRegister() {
    this.router.navigate(['/register']);
  }
}