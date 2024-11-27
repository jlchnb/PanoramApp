import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements AfterViewInit {
  map!: L.Map;
  marker!: L.Marker;
  categorias = ['Gratis', 'Pago', 'Social' , 'Familiar', 'Música', 'Educativo', 'Deporte', 'Espectáculo'];

  evento = {
    id: '',
    lat: -33.015347,
    lng: -71.550026,
    nombre: '',
    fecha: new Date(),
    ubicacion: '',
    categorias: [],
    imagen: '',
    precio: 0,
    horainicio: ''
  };

  fechaActual: Date = new Date();

  constructor(
    private eventosService: EventosService,
    private router: Router
  ) {}

  async ngAfterViewInit(): Promise<void> {
    const userLocation = await this.getUserLocation();
    this.initMap(userLocation.lat, userLocation.lng);
  }

  async getUserLocation(): Promise<{ lat: number; lng: number }> {
    try {
      const position = await Geolocation.getCurrentPosition();
      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    } catch (error) {
      console.error('Error al obtener ubicación del usuario:', error);
      return { lat: -33.015, lng: -71.550 };
    }
  }

  initMap(lat: number, lng: number): void {
    this.map = L.map('map').setView([lat, lng], 13);
    this.evento.lat = lat;
    this.evento.lng = lng;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', (event) => {
      const position = (event.target as L.Marker).getLatLng();
      this.evento.lat = position.lat;
      this.evento.lng = position.lng;
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.evento.lat = lat;
      this.evento.lng = lng;
      this.marker.setLatLng([lat, lng]);
    });
  }

  verificarFecha(): boolean {
    const fechaEvento = new Date(this.evento.fecha);
    if (fechaEvento < this.fechaActual) {
      alert('La fecha del evento no puede ser en el pasado.');
      return false;
    }
    return true;
  }

  async crearEvento() {
    try {
      this.evento.id = uuidv4();
      
      if (typeof this.evento.fecha === 'string') {
        this.evento.fecha = new Date(this.evento.fecha);
      }
  
      await this.eventosService.crearEvento(this.evento);
      console.log('Evento creado correctamente');
      this.router.navigate(['/lista-eventos']);
    } catch (error) {
      console.error('Error al crear el evento:', error);
    }
  }
}