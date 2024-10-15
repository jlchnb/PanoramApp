import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { EventosService } from '../services/eventos/eventos.service';
import { Evento } from '../models/Evento';
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

  constructor(
    private navCtrl: NavController, 
    private eventosService: EventosService,
    private loadingController: LoadingController // Agregado para loading
  ) {}

  async ngOnInit() {
    // Mostrar el loading
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
      loading.dismiss(); // Asegurarse de cerrar el loading
    }

    this.loggedUser = sessionStorage.getItem('loggedUser') || ''; 
    console.info('Usuario logueado:', this.loggedUser);
  }

  goToLogin() {
    sessionStorage.removeItem('loggedUser');
    this.loggedUser = '';
    this.navCtrl.navigateForward('/welcome');
  }
}