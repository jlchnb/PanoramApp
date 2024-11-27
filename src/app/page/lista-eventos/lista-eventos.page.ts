import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/Evento';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-lista-eventos',
  templateUrl: './lista-eventos.page.html',
  styleUrls: ['./lista-eventos.page.scss'],
})
export class ListaEventosPage implements OnInit {

  eventos: Evento[] = [];

  constructor(private _eventosService: EventosService, private navCtrl: NavController) { }

  async ngOnInit() {
    this.eventos = await this._eventosService.obtenerEventos();
    console.info(this.eventos);
  }

  goToHome() {
    this.navCtrl.navigateForward('/home');
  }
}