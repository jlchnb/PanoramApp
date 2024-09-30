import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/Usuario';
import { UsersService } from 'src/app/services/usuarios/users.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  userLogin: Usuario = {
    username: '',
    password: '',
    role: 'admin'
  };

  constructor(
    private alertController: AlertController,
    private _usersLogin: UsersService,
    private modalCtrl: ModalController
  ) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Datos incorrectos',
      message: 'Usuario no existe o datos erroneos.',
      buttons: ['OK'],
      cssClass: 'custom-alert-header',
      mode: 'ios',
    });

    await alert.present();
  }

  async login() {
    console.info('Datos de login:', this.userLogin);

    if (!this.userLogin.username) {
      await this.presentAlert();
      return;
    }

    const usuario = this._usersLogin.getUsuario(this.userLogin.username);
    console.info(usuario);
    
    if (usuario && usuario.password === this.userLogin.password) {
      console.info(usuario, '¡Acceso concedido!');

      if (usuario.username) {
        sessionStorage.setItem('loggedUser', usuario.username);
      }

      if (usuario.role === 'admin') {
        console.info('soy un admin');
        await this.modalCtrl.dismiss({
          userInfo: usuario,
          redirectTo: 'lista-usuarios'
        });
      } else {
        console.info('soy un usuario');
        await this.modalCtrl.dismiss({
          userInfo: usuario,
          redirectTo: 'home'
        });
      }
    } else {
      this.presentAlert();
    }
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}
