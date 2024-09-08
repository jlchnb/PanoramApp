import { Component, OnInit } from '@angular/core';
import { UserLogin } from 'src/app/models/userLogin';
import { UsersService } from 'src/app/api/users/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userLogin: UserLogin = {
    username: '',
    password: '',
    role: 'admin'
  };

  constructor(private _usersLogin: UsersService, private router: Router) { }

  ngOnInit() { }

  login() {
    console.info('Datos de login:', this.userLogin);
    const usuario = this._usersLogin.getUsuario(this.userLogin.username);
    console.info(usuario)
    if (usuario?.password === this.userLogin.password) {
      console.info(usuario, 'estoy dentro!!')
      if (usuario.role === 'admin') {
        console.info('soy un admin')
        this.router.navigate(['lista-usuarios'], {
          state: {
            userInfo: usuario
          }
        });
      } else {
        console.info('soy un usuario')
        this.router.navigate(['home'], {
          state: {
            userInfo: usuario
          }
        });
      }
    } else {
      console.info('Error, usuario no existe o datos incorrectos');
    }
  }
}
