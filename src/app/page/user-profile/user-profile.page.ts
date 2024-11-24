import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/models/Usuario';
import { UsersService } from 'src/app/services/usuarios/users.service';
import { Router } from '@angular/router'; // Necesario para la navegación

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {
  loggedUser!: Usuario;
  isAnonymous: boolean = false; // Nueva propiedad para verificar si es invitado

  constructor(
    private usersService: UsersService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router // Agregamos el Router para redirigir al registro
  ) {
    const storedUser = sessionStorage.getItem('userkey');
    console.log('Datos que recibo en UserProfile:', storedUser);
    
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      this.isAnonymous = this.loggedUser.role === 'anonymous'; // Establecemos si es invitado
    } else {
      this.loggedUser = {
        username: 'Error',
        password: '',
        role: 'anonymous',
        isVerified: false
      };
      this.isAnonymous = true; // Si no hay usuario, consideramos que es un invitado
    }
  }

  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Está seguro de que desea eliminar su cuenta?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí',
          handler: async () => {
            await this.deleteUser();
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteUser() {
    const username = this.loggedUser.username;
    
    if (!username) {
      console.error('El nombre de usuario no está definido');
      return;
    }
    
    try {
      await this.usersService.deleteUser(username);
      sessionStorage.removeItem('loggedUser');
  
      const successAlert = await this.alertController.create({
        header: 'Éxito',
        message: 'Usuario eliminado correctamente',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.navCtrl.navigateForward('/welcome');
          }
        }]
      });
      await successAlert.present();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo eliminar el usuario.',
        buttons: ['Aceptar']
      });
      await errorAlert.present();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']); // Redirige al usuario a la página de registro
  }
}