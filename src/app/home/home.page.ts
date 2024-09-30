import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EventosService } from '../services/eventos/eventos.service';
import { Evento } from '../models/Evento';
import { UsersService } from '../services/usuarios/users.service';
import { Usuario } from '../models/Usuario';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isTodayEventVisible: boolean = true;
  eventos: Evento[] = [];
  usuarios: Usuario[] = [];
  loggedUser: string = '';

  constructor(private _usersService: UsersService, private navCtrl: NavController, private eventosService: EventosService) { }

  ngOnInit() {
    this.eventos = this.eventosService.obtenerEventos();
    
    this.loggedUser = sessionStorage.getItem('loggedUser') || ''; 
    console.info('Usuario logueado:', this.loggedUser);
  }

  goToLogin() {
    this.navCtrl.navigateForward('/welcome');
  }
}