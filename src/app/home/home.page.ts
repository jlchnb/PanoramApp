import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { EventosService } from '../services/eventos/eventos.service';
import { Evento } from '../models/Evento';
import { Usuario } from '../models/Usuario';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isTodayEventVisible: boolean = true;
  eventos: Evento[] = [];
  usuarios: Usuario[] = [];
  loggedUser: Usuario = {username: 'julito', role: 'admin'};

  constructor(
    private navCtrl: NavController, 
    private eventosService: EventosService,
    private loadingController: LoadingController,
    private router: Router,
  ) {}

  async ShareEvent() {
    await Share.share({
      title: 'PanoramApp link para amigos',
      text: 'Pasate por mi app ;)',
      url: 'https://github.com/jlchnb/PanoramApp',
      dialogTitle: 'Comparte con amigos',
    });
  }
  

  async ngOnInit() {
    this.loggedUser = JSON.parse(sessionStorage.getItem('userkey') || '{}' );
    console.log('Usuario logueado:', this.loggedUser);

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
  }

  goToLogin() {
    sessionStorage.removeItem('userkey');
    this.navCtrl.navigateForward('/welcome');
  }

  goToPerfil() {
    console.log('Contenido del sessionStorage antes de navegar:', sessionStorage.getItem('userkey'));
    this.navCtrl.navigateForward('/user-profile');
  }

  goToMaps() {
    console.log('Navegando a Eventos');
    this.navCtrl.navigateForward('/mapa');
  }

  // goToAjustes() {
  //   console.log('Navegando a Ajustes');
  // }

  goToAdminPanel() {
    if (this.loggedUser?.role === 'admin') {
      this.router.navigate(['/admin-tabs']);
    }
  }
}