// src/app/services/eventos.service.ts

import { Injectable } from '@angular/core';
import { Evento } from '../models/evento';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private eventos: Evento[] = [
    {
      id: 1,
      nombre: 'Reino medieval en jardín botánico',
      fecha: new Date('2024-09-15T11:00:00'),
      ubicacion: 'Jardín Botánico',
      categorias: ['Familiar', 'Gratis'],
      imagen: 'reino_medieval.jpg'
    },
    {
      id: 2,
      nombre: 'Tocata en vivo - Roman Rojas',
      fecha: new Date('2024-09-15T19:00:00'),
      ubicacion: 'Auditorio Central',
      categorias: ['Social', 'Música'],
      imagen: 'tocata_roman.jpg'
    }
  ];

  constructor() { }

  obtenerEventos(): Evento[] {
    return this.eventos;
  }
}
