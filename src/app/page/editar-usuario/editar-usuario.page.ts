import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/Usuario';
import { UsersService } from 'src/app/services/usuarios/users.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {
  usuario!: Usuario;

  constructor(private modalCtrl: ModalController, private _usersService: UsersService) { }

  ngOnInit() {
  }

  async onSubmit() {
    try {
      await this._usersService.updateUser(this.usuario);
      this.dismiss({ updated: true });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }
}