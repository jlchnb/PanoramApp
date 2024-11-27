import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/Evento';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { NavController, ModalController } from '@ionic/angular';
import { EditarEventoPage } from '../editar-evento/editar-evento.page';  // Asegúrate de crear esta página

@Component({
  selector: 'app-lista-eventos',
  templateUrl: './lista-eventos.page.html',
  styleUrls: ['./lista-eventos.page.scss'],
})
export class ListaEventosPage implements OnInit {

  eventos: Evento[] = [];

  constructor(
    private _eventosService: EventosService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    await this.loadEventos();
  }

  ionViewWillEnter() {
    console.log('Entrando en la página de lista-eventos...');
    this.loadEventos();
  }

  async loadEventos() {
    this.eventos = await this._eventosService.obtenerEventos();
    console.info('Eventos cargados:', this.eventos);
  }

  goToHome() {
    this.navCtrl.navigateForward('/home');
  }

  async crearEvento() {
    this.navCtrl.navigateForward('/crear-evento');  // Ruta a la página de creación de eventos
  }

  async editarEvento(evento: Evento) {
    const modal = await this.modalCtrl.create({
      component: EditarEventoPage,
      componentProps: { evento }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.updated) {
      this.loadEventos();
    }
  }

  async eliminarEvento(evento: Evento) {
    const confirm = window.confirm('¿Está seguro de eliminar este evento?');
    if (confirm && evento.id) {
      try {
        await this._eventosService.eliminarEvento(evento.id);
        this.eventos = this.eventos.filter(e => e.id !== evento.id);
        console.log(`Evento ${evento.nombre} eliminado correctamente.`);
      } catch (error) {
        console.error('Error al eliminar el evento:', error);
      }
    } else {
      console.error('ID de evento no definido.');
    }
  }

  doRefresh(event: any) {
    this.loadEventos().then(() => {
      event.target.complete();
    });
  }
}