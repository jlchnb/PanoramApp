import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase/supabase.service.spec';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-fav',
  templateUrl: './fav.page.html',
  styleUrls: ['./fav.page.scss'],
})
export class FavPage implements OnInit {
  eventos: any[] = [];
  favoriteEvents: any[] = [];
  loggedUser: Usuario | null = null;

  constructor(
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    try {
      // Obtén el usuario logueado desde Supabase (o tu lógica actual para obtenerlo)
      this.loggedUser = await this.supabaseService.getLoggedUser();

      // Carga todos los eventos desde Supabase
      this.eventos = await this.supabaseService.getAllEventos();

      // Filtra los eventos favoritos basándote en el array favoritos del usuario
      this.favoriteEvents = this.loggedUser?.favoritos?.map((id: number) =>
        this.eventos.find((evento) => evento.id === id)
      ) || [];
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  }

  // Método para compartir un evento
  ShareEvent(evento: any) {
    console.log('Compartiendo evento:', evento.nombre);
    // Aquí puedes agregar la lógica del plugin Share de Capacitor
  }

  // Método para alternar favoritos
  async toggleFavorite(evento: any) {
    if (!this.loggedUser || !this.loggedUser.favoritos) return;

    const index = this.loggedUser.favoritos.indexOf(evento.id);
    if (index > -1) {
      this.loggedUser.favoritos.splice(index, 1); // Elimina el ID del array
    } else {
      this.loggedUser.favoritos.push(evento.id); // Agrega el ID al array
    }

    // Actualiza los favoritos del usuario en Supabase
    await this.supabaseService.updateUserFavoritos(this.loggedUser.id, this.loggedUser.favoritos);

    // Actualiza la lista de favoritos en tiempo real
    this.favoriteEvents = this.loggedUser.favoritos.map((id: number) =>
      this.eventos.find((evento) => evento.id === id)
    );
  }

  // Método para verificar si un evento es favorito
  isFavorite(evento: any): boolean {
    return this.loggedUser?.favoritos?.includes(evento.id);
  }
}