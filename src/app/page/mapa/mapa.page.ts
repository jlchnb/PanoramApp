import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';
import { EventosService } from 'src/app/services/eventos/eventos.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  map: L.Map | null = null;
  userLocation: { lat: number; lng: number } | null = null;

  constructor(
    private navCtrl: NavController,
    private eventosService: EventosService
  ) {}

  ngOnInit() {
    // Solo se cargará el mapa cuando la vista esté lista
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    // Configuración del ícono predeterminado para los marcadores
    L.Marker.prototype.options.icon = L.icon({
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Inicializa el mapa
    this.map = L.map('map').setView([0, 0], 13);

    // Configura las capas del mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.getCurrentLocation();
    this.addEventosToMap();
  }

  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      if (this.map && this.userLocation) {
        // Ajusta la vista del mapa a la ubicación del usuario
        this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);

        // Agrega un marcador en la ubicación del usuario
        L.marker([this.userLocation.lat, this.userLocation.lng])
          .addTo(this.map)
          .bindPopup('Tu ubicación actual')
          .openPopup();
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  async addEventosToMap() {
    const eventos = await this.eventosService.obtenerEventos();

    if (this.map) {
      eventos.forEach((evento) => {
        if (evento.lat && evento.lng) {
          // Agrega marcadores para cada evento
          L.marker([evento.lat, evento.lng])
            .addTo(this.map!)
            .bindPopup(`
              <strong>${evento.nombre}</strong><br>
              ${evento.ubicacion}<br>
              Fecha: ${evento.fecha.toLocaleDateString()}<br>
              Hora de inicio: ${evento.horainicio}
            `);
        }
      });

      this.map.invalidateSize();
    }
  }

  goToLogin() {
    this.navCtrl.navigateBack('/home');
  }
}