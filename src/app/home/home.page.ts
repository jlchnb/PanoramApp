import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  isTodayEventVisible: boolean = true;
  constructor(private navCtrl: NavController) { }

  goToLogin() {
    this.navCtrl.navigateForward('/welcome');
  }

  
}
