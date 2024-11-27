import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/Evento';
import { Usuario } from 'src/app/models/Usuario';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { UsersService } from 'src/app/services/usuarios/users.service';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { supabase } from 'src/app/services/supabase/supabase.service';


@Component({
  selector: 'app-fav',
  templateUrl: './fav.page.html',
  styleUrls: ['./fav.page.scss'],
})
export class FavPage implements OnInit {
  eventos: Evento[] = [];
  favoriteEvents: Evento[] = [];
  loggedUser: Usuario | null = null;

  constructor(
    private eventosService: EventosService,
    private usersService: UsersService,
    private authService: AuthServiceService
  ) {}

  async ngOnInit() {
    await this.loadData();
    await this.cargarFavoritos();
  }

  async cargarFavoritos() {
    try {
      this.loggedUser = await this.authService.getUserData();
      const hola = await this.usersService.getUsuario(this.loggedUser?.username || '' )
      console.log('Soy el hola' , hola)
      console.log('El usuario logueado', this.loggedUser)
      if (!hola || !hola.favoritos) {
        console.log('No hay usuario logueado o no tiene favoritos.');
        this.favoriteEvents = [];
        return;
      }
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .in('id', hola.favoritos);

      if (error) {
        console.error('Error al cargar los eventos favoritos:', error.message);
        return;
      }

      this.favoriteEvents = data as Evento[];
      console.log('Eventos favoritos cargados:', this.favoriteEvents);
    } catch (error) {
      console.error('Error inesperado al cargar favoritos:', error);
    }
  }

  async loadData() {
    try {
      this.loggedUser = await this.usersService.getUsuario('usuario_logueado');

      if (!this.loggedUser) {
        console.error('No hay usuario logueado.');
        return;
      }

      this.eventos = await this.eventosService.obtenerEventos();

      this.updateFavoriteEvents();
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  async obtenerUsuarioLogueado() {
    const userData = await this.authService.getUserData();
    if (!userData) {
      console.error('No hay usuario logueado.');
      return null;
    }
    console.log('Usuario logueado:', userData);
    return userData;
  }

  updateFavoriteEvents() {
    if (!this.loggedUser || !this.loggedUser.favoritos) {
      this.favoriteEvents = [];
      return;
    }
  
    this.favoriteEvents = this.eventos.filter((evento) => {
      return this.loggedUser!.favoritos!.includes(evento.id) && evento.id !== null;
    });
  }

  /**
   * Alterna el estado de favorito de un evento.
   * @param evento Evento al que se desea agregar o quitar de favoritos.
   */
  async toggleFavorite(evento: Evento) {
    if (!this.loggedUser) {
      console.error('No hay usuario logueado.');
      return;
    }
  
    try {
      const eventoId = evento.id;
      const isFavorite = this.loggedUser.favoritos?.includes(eventoId);
  
      if (isFavorite) {
        const nuevosFavoritos = this.loggedUser.favoritos?.filter(
          (id) => id !== eventoId
        );
  
        const { error } = await supabase
          .from('usuarios')
          .update({ favoritos: nuevosFavoritos })
          .eq('id', this.loggedUser.id);
        if (error) throw new Error('Error al eliminar de favoritos.');
  
        this.loggedUser.favoritos = nuevosFavoritos;
      } else {
        const nuevosFavoritos = [...(this.loggedUser.favoritos || []), eventoId];
  
        const { error } = await supabase
          .from('usuarios')
          .update({ favoritos: nuevosFavoritos })
          .eq('id', this.loggedUser.id);
  
        if (error) throw new Error('Error al agregar a favoritos.');
  
        this.loggedUser.favoritos = nuevosFavoritos;
      }
  
      this.updateFavoriteEvents();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al actualizar favoritos:', error.message);
      } else {
        console.error('Error desconocido al actualizar favoritos:', error);
      }
    }
  }  

  /**
   * Verifica si un evento es favorito.
   * @param evento Evento a verificar.
   * @returns True si el evento es favorito, false en caso contrario.
   */
  isFavorite(evento: Evento): boolean {
    return this.loggedUser?.favoritos?.includes(evento.id) || false;
  }

  /**
   * Comparte un evento.
   * @param evento Evento a compartir.
   */
  ShareEvent(evento: Evento) {
    console.log('Compartiendo evento:', evento.nombre);
  }
}