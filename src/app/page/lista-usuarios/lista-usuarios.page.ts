import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { UsersService } from 'src/app/services/usuarios/users.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
})
export class ListaUsuariosPage implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private _usersService: UsersService, private navCtrl: NavController) { }

  async ngOnInit() {
    // Esperar a que la promesa se resuelva antes de asignar a 'usuarios'
    this.usuarios = await this._usersService.getAlluser();
    console.info(this.usuarios);
  }

  goToHome() {
    this.navCtrl.navigateForward('/home');
  }
}