import { Component } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Usuario } from 'src/app/models/Usuario';
import { UsersService } from 'src/app/services/usuarios/users.service';

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
    private modalCtrl: ModalController,
    private loadingController: LoadingController
  ) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Datos incorrectos',
      message: 'Usuario no existe o datos erróneos.',
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

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'circles',
    });
    await loading.present();

    try {
      const usuario = await this._usersLogin.getUsuario(this.userLogin.username);
      console.info(usuario);

      if (usuario && usuario.password === this.userLogin.password) {
        console.info(usuario, '¡Acceso concedido!');

        if (usuario.username) {
          sessionStorage.setItem('loggedUser', JSON.stringify(usuario));
      }

        if (usuario.role === 'admin') {
          console.info('Soy un admin');
          await this.modalCtrl.dismiss({
            userInfo: usuario,
            redirectTo: 'admin-tabs'
          });
        } else {
          console.info('Soy un usuario');
          await this.modalCtrl.dismiss({
            userInfo: usuario,
            redirectTo: 'home'
          });
        }
      } else {
        await this.presentAlert();
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      await this.presentAlert();
    } finally {
      await loading.dismiss();
    }
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}