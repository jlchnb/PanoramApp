import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { UsersService } from 'src/app/services/usuarios/users.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage {
  newUser: Usuario = {
    username: '',
    password: '',
    role: 'user',
    isVerified: false,
  };

  constructor(
    private usersService: UsersService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  async crearUsuario() {
    if (!this.newUser.username || !this.newUser.password) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Todos los campos son obligatorios.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      await this.usersService.createUser(this.newUser);
      const successAlert = await this.alertController.create({
        header: 'Éxito',
        message: 'Usuario creado correctamente.',
        buttons: ['OK']
      });
      await successAlert.present();
      this.navCtrl.navigateBack('/admin-tabs/usuarios');
    } catch (error) {
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al crear el usuario.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }
}