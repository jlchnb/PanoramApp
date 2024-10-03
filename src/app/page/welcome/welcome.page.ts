import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

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

  continueAsGuest() {
    this.navCtrl.navigateForward('/home');
  }
}