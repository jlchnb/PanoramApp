import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { EventosService } from '../services/eventos/eventos.service';
import { Evento } from '../models/Evento';
import { Usuario } from '../models/Usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isTodayEventVisible: boolean = true;
  eventos: Evento[] = [];
  usuarios: Usuario[] = [];
  loggedUser: Usuario;

  constructor(
    private navCtrl: NavController, 
    private eventosService: EventosService,
    private loadingController: LoadingController,
    private router: Router
  ) {
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser') || '{"username": "", "role": "anonymous"}');
    console.log('Usuario logueado:', this.loggedUser);

  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
        message: 'Cargando datos...',
        spinner: 'circles',
    });
    await loading.present();

    try {
        this.eventos = await this.eventosService.obtenerEventos();
        console.info('Eventos obtenidos:', this.eventos);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
    } finally {
        loading.dismiss();
    }

    console.info('Usuario logueado:', this.loggedUser);
  }

  goToLogin() {
    sessionStorage.removeItem('loggedUser');
    this.loggedUser = { username: '', role: 'anonymous' };
    this.navCtrl.navigateForward('/welcome');
  }

  goToPerfil() {
    console.log('Navegando a Perfil');
  }

  goToEventos() {
    console.log('Navegando a Eventos');
  }

  goToAjustes() {
    console.log('Navegando a Ajustes');
  }

  goToAdminPanel() {
    if (this.loggedUser?.role === 'admin') {
      this.router.navigate(['/admin-tabs']);
    }
  }
}