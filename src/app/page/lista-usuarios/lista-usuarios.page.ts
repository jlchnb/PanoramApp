import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { UsersService } from 'src/app/services/usuarios/users.service';
import { NavController, ModalController } from '@ionic/angular';
import { EditarUsuarioPage } from '../editar-usuario/editar-usuario.page';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
})
export class ListaUsuariosPage implements OnInit {

  usuarios: Usuario[] = [];

  constructor(
    private _usersService: UsersService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    this.usuarios = await this._usersService.getAllUsers();
    console.info('Los usuarios', this.usuarios);
    await this.loadUsuarios();
  }

  ionViewWillEnter() {
    console.log('Entrando en la página de lista-usuarios...');
    this.loadUsuarios();
  }

  async loadUsuarios() {
    this.usuarios = await this._usersService.getAllUsers();
    console.info('Usuarios actualizados:', this.usuarios);
  }

  async goToHome() {
    this.navCtrl.navigateForward('/home');
  }

  async crearUsuario() {
    this.navCtrl.navigateForward('/crear-usuario');
  }
  
  async editarUsuario(usuario: Usuario) {
    const modal = await this.modalCtrl.create({
      component: EditarUsuarioPage,
      componentProps: { usuario }
    });
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data && data.updated) {
      this.loadUsuarios();
    }
  }

  async eliminarUsuario(usuario: Usuario) {
    const confirm = window.confirm('¿Está seguro de eliminar este usuario?');
    if (confirm && usuario.username) {
      try {
        await this._usersService.deleteUser(usuario.username);
        this.usuarios = this.usuarios.filter(u => u.username !== usuario.username);
        console.log(`Usuario ${usuario.username} eliminado correctamente.`);
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    } else {
      console.error('El nombre de usuario es undefined.');
    }
  }

  async onUserCreated() {
    await this.loadUsuarios();
  }

  doRefresh(event: any) {
    this.loadUsuarios().then(() => {
      event.target.complete();
    });
  }
}