import { Injectable } from '@angular/core';
import { UserLogin } from 'src/app/models/userLogin';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usuarios: UserLogin[] = [
    {
      username: "julio",
      password: "duoc123",
      role: "admin"
    },
    {
      username: "miguel",
      password: "123duoc",
      role: "user"
    }
  ];

  constructor() { }

  validar_usuario(userLogin: UserLogin): boolean {
    console.log('Usuarios:', this.usuarios);
    return this.usuarios.some(user =>
      user.username === userLogin.username &&
      user.password === userLogin.password
    );
  }
  
  esAdmin(userLogin: UserLogin): boolean {
    const usuario = this.getUsuario(userLogin.username);
    return usuario ? usuario.role === 'admin' : false;
  }

  getUsuario(username: string): UserLogin | undefined {
    return this.usuarios.find(user => user.username === username);
  }

  getAlluser(): UserLogin[] {
    return this.usuarios;
  }
}
