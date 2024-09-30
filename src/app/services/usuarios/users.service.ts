import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario'; // Cambia la importación de UserLogin a Usuario

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // Cambiar el tipo de datos del array de usuarios a Usuario
  private usuarios: Usuario[] = [
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

  // Cambiar el tipo del parámetro a Usuario
  validar_usuario(usuario: Usuario): boolean {
    console.log('Usuarios:', this.usuarios);
    return this.usuarios.some(user =>
      user.username === usuario.username &&
      user.password === usuario.password
    );
  }

  // Cambiar el tipo del parámetro a Usuario
  esAdmin(usuario: Usuario): boolean {
    // Usar el operador de coalescencia nula para evitar pasar undefined
    const encontrado = this.getUsuario(usuario.username ?? '');
    return encontrado ? encontrado.role === 'admin' : false;
  }

  // Cambiar el tipo de retorno a Usuario o undefined
  getUsuario(username: string): Usuario | undefined {
    return this.usuarios.find(user => user.username === username);
  }

  // Cambiar el tipo de retorno a Usuario[]
  getAlluser(): Usuario[] {
    return this.usuarios;
  }
}
