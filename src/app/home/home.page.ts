import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EventosService } from '../services/eventos.service';
import { Evento } from '../models/evento';
import { UsersService } from '../api/users/users.service';
import { UserLogin } from '../models/userLogin';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isTodayEventVisible: boolean = true;
  eventos: Evento[] = [];
  usuarios: UserLogin[] = [];
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