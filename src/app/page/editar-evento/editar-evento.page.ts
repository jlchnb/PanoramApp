import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/Evento';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.page.html',
  styleUrls: ['./editar-evento.page.scss'],
})
export class EditarEventoPage implements OnInit {
  evento: Evento | undefined;
  
  eventos: Evento[] = [];

  constructor(
    private _eventosService: EventosService,
    private navCtrl: NavController,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    await this.loadEventos();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async loadEventos() {
    this.eventos = await this._eventosService.obtenerEventos();
    console.info('Eventos cargados:', this.eventos);
  }

  async guardarEvento() {
    if (this.evento) {
      await this._eventosService.actualizarEvento(this.evento);
    } else {
      console.error('No se puede guardar, el evento es undefined');
    }
  }  

  goToHome() {
    this.navCtrl.navigateForward('/home');
  }

  async crearEvento() {
    this.navCtrl.navigateForward('/crear-evento');
  }

  async editarEvento(evento: Evento) {
    const modal = await this.modalController.create({
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