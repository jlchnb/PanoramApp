import { Component, OnInit } from '@angular/core';
import { UserLogin } from 'src/app/models/userLogin';
import { UsersService } from 'src/app/api/users/users.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
})
export class ListaUsuariosPage implements OnInit {

  usuarios: UserLogin[] = [];

  constructor(private _usersService: UsersService, private navCtrl: NavController) { }

  ngOnInit() {
    this.usuarios = this._usersService.getAlluser();
    console.info(this.usuarios);
  }

  goToHome() {
    this.navCtrl.navigateForward('/home');
  }
}