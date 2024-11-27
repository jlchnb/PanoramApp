import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { EventosService } from '../services/eventos/eventos.service';
import { Evento } from '../models/Evento';
import { Usuario } from '../models/Usuario';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { UsersService } from '../services/usuarios/users.service';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { supabase } from '../services/supabase/supabase.service';

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
  eventosFiltrados: Evento[] = [];
  eventosSemanaActual: Evento[] = [];
  eventosProximaSemana: Evento[] = [];
  eventosSubsiguienteSemana: Evento[] = [];

  selectedSegment: string = 'estaSemana';

  currentWeek: string = '';
  nextWeek: string = '';
  followingWeek: string = '';

  today: Date = new Date();

  constructor(
    private navCtrl: NavController, 
    private eventosService: EventosService,
    private usersService: UsersService,
    private loadingController: LoadingController,
    private router: Router,
    private storage: Storage,
    private toastController: ToastController,
    private authService: AuthServiceService
  ) {}

  async ShareEvent() {
    await Share.share({
      title: 'PanoramApp link para amigos y familiares',
      text: 'Pasate por mi app ;)',
      url: 'https://github.com/jlchnb/PanoramApp',
      dialogTitle: 'Comparte con amigos y familiares',
    });
  }
  

  async ngOnInit() {
    await this.storage.create();
  
    // Verifica que los datos del usuario se obtengan correctamente desde sessionStorage
    const storedUserData = sessionStorage.getItem('userkey');
    if (storedUserData) {
      this.loggedUser = JSON.parse(storedUserData);
    } else {
      // Si no hay datos en sessionStorage, establecer valores predeterminados
      this.loggedUser = {
        username: 'Invitado',  // Cambiar por "Modo invitado" si el role es 'anonymous'
        role: 'anonymous',
        favoritos: [],
      };
    }
  
    console.log('Usuario logueado:', this.loggedUser);
  
    this.updateWeekLabels();
  
    const loading = await this.loadingController.create({
      message: 'Cargando datos...',
      spinner: 'circles',
    });
    await loading.present();
  
    try {
      await this.getLoggedUserFavorites();
      await this.cargarEventos();
      await this.updateEventos();
      this.eventosFiltrados = this.eventosSemanaActual;
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      loading.dismiss();
    }
  }  

  async getLoggedUserFavorites() {
    try {
      const userData = await this.authService.getUserData();
      if (!userData) {
        console.error('No hay usuario logueado.');
        return;
      }
      this.loggedUser = userData;
      console.log('Favoritos del usuario logueado:', this.loggedUser.favoritos || []);
    } catch (error) {
      console.error('Error al obtener favoritos del usuario:', error);
    }
  }

  async loadEventos() {
    this.eventos = await this.eventosService.obtenerEventos();
  }

  async cargarEventos() {
    const eventosData = await this.eventosService.obtenerEventos();
    console.log(eventosData);
    
    this.eventos = eventosData;
    this.updateEventos();
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

  goToFavorites(){
    console.log('Navegando a Favoritos');
    this.navCtrl.navigateForward('/fav');
  }

  goToSettings() {
    console.log('Navegando a configurar');
    this.navCtrl.navigateForward('/settings');
  }

  goToAdminPanel() {
    if (this.loggedUser?.role === 'admin') {
      this.router.navigate(['/admin-tabs']);
    }
  }
  
  isInCurrentWeek(fecha: Date): boolean {
    const inicioSemana = this.startOfWeek(new Date());
    const finSemana = this.endOfWeek(inicioSemana);
    return fecha >= inicioSemana && fecha <= finSemana;
  }
  
  isInNextWeek(fecha: Date): boolean {
    const inicioProximaSemana = this.startOfWeek(new Date(), 7);
    const finProximaSemana = this.endOfWeek(inicioProximaSemana);
    return fecha >= inicioProximaSemana && fecha <= finProximaSemana;
  }
  
  isInSubsequentWeek(fecha: Date): boolean {
    const inicioSubsiguienteSemana = this.startOfWeek(new Date(), 14);
    const finSubsiguienteSemana = this.endOfWeek(inicioSubsiguienteSemana);
    return fecha >= inicioSubsiguienteSemana && fecha <= finSubsiguienteSemana;
  }
  
  startOfWeek(date: Date, offset = 0): Date {
    const targetDate = new Date(date);
    const day = targetDate.getDay();
    const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1) + offset;
    const start = new Date(targetDate.setDate(diff));
    start.setHours(0, 0, 0, 0);
    return start;
  }
  
  endOfWeek(start: Date): Date {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  private updateWeekLabels(): void {
    const today = new Date();

    const currentWeekStart = this.getMonday(today);
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);

    const followingWeekStart = new Date(nextWeekStart);
    followingWeekStart.setDate(followingWeekStart.getDate() + 7);
    const followingWeekEnd = new Date(followingWeekStart);
    followingWeekEnd.setDate(followingWeekEnd.getDate() + 6);

    this.currentWeek = this.formatWeekLabel(currentWeekStart, currentWeekEnd);
    this.nextWeek = this.formatWeekLabel(nextWeekStart, nextWeekEnd);
    this.followingWeek = this.formatWeekLabel(followingWeekStart, followingWeekEnd);
  }

  private formatWeekLabel(start: Date, end: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('es-ES', options)} - ${end.toLocaleDateString('es-ES', options)}`;
  }
  
  updateEventos() {
    const inicioSemanaActual = this.startOfWeek(new Date());
    const finSemanaActual = this.endOfWeek(inicioSemanaActual);
  
    const inicioProximaSemana = this.startOfWeek(new Date(), 7);
    const finProximaSemana = this.endOfWeek(inicioProximaSemana);
  
    const inicioSubsiguienteSemana = this.startOfWeek(new Date(), 14);
    const finSubsiguienteSemana = this.endOfWeek(inicioSubsiguienteSemana);
  
    this.eventosSemanaActual = this.filtrarEventosPorSemana(inicioSemanaActual, finSemanaActual);
    this.eventosProximaSemana = this.filtrarEventosPorSemana(inicioProximaSemana, finProximaSemana);
    this.eventosSubsiguienteSemana = this.filtrarEventosPorSemana(inicioSubsiguienteSemana, finSubsiguienteSemana);
  
    this.currentWeek = `Semana del ${inicioSemanaActual.toLocaleDateString()} al ${finSemanaActual.toLocaleDateString()}`;
    this.nextWeek = `Semana del ${inicioProximaSemana.toLocaleDateString()} al ${finProximaSemana.toLocaleDateString()}`;
    this.followingWeek = `Semana del ${inicioSubsiguienteSemana.toLocaleDateString()} al ${finSubsiguienteSemana.toLocaleDateString()}`;
  }

  filtrarEventosPorSemana(inicioSemana: Date, finSemana: Date): Evento[] {
    return this.eventos.filter(evento => {
      if (!(evento.fecha instanceof Date)) {
        console.error('Fecha inválida en el evento:', evento);
        return false;
      }
  
      const fechaEvento = evento.fecha;
      return fechaEvento >= inicioSemana && fechaEvento <= finSemana;
    });
  }  

  getMonday(date: Date): Date {
    const day = date.getDay(),
          diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  getSunday(date: Date): Date {
    const day = date.getDay(),
          diff = date.getDate() - day + (day === 0 ? 0 : 7);
    return new Date(date.setDate(diff));
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  cambiarFiltro(event: any) {
    this.selectedSegment = event?.detail?.value || 'estaSemana';
    if (this.selectedSegment === 'estaSemana') {
        this.eventosFiltrados = this.eventosSemanaActual;
    } else if (this.selectedSegment === 'proximaSemana') {
        this.eventosFiltrados = this.eventosProximaSemana;
    } else if (this.selectedSegment === 'subsiguienteSemana') {
        this.eventosFiltrados = this.eventosSubsiguienteSemana;
    }
  }

  isFavorite(evento: any): boolean {
    return Array.isArray(this.loggedUser?.favoritos) && this.loggedUser.favoritos.includes(evento.id);
  }

  async toggleFavorite(evento: any): Promise<void> {
    if (!this.loggedUser) {
      console.error('No hay usuario logueado.');
      return;
    }
  
    try {
      const isFavorite = this.isFavorite(evento);
      
      if (isFavorite) {
        this.loggedUser = await this.usersService.removeFromFavorites(this.loggedUser, evento.id);
        this.showToast('Eliminado de favoritos');
      } else {
        this.loggedUser = await this.usersService.addToFavorites(this.loggedUser, evento.id);
        this.showToast('Agregado a favoritos');
      }
    
      localStorage.setItem('favoritos', JSON.stringify(this.loggedUser.favoritos));
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    }
  }

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  async addToFavorites(user: Usuario, eventoId: string): Promise<Usuario> {
    if (!user.favoritos) {
      user.favoritos = [];
    }
  
    if (!user.favoritos.includes(eventoId)) {
      user.favoritos.push(eventoId);
    }
  
    console.log('ID del usuario:', user.id);
  
    if (!user.id) {
      console.error('ID del usuario no disponible.');
      throw new Error('ID del usuario no disponible');
    }
  
    console.log('Usuario antes del PATCH:', user);
    if (!user.id) {
      console.error('El ID del usuario no está definido.');
      throw new Error('ID del usuario requerido para actualizar favoritos');
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update({ favoritos: user.favoritos })
      .eq('id', user.id);
  
    if (error) {
      console.error('Error al agregar a favoritos:', error.message);
      throw new Error('Error al agregar a favoritos');
    }
  
    return { ...user, favoritos: user.favoritos };
  }  

  async removeFromFavorites(user: Usuario, eventoId: string): Promise<Usuario> {
    if (user.favoritos) {
      user.favoritos = user.favoritos.filter(id => id !== eventoId);
    }
  
    const { data, error } = await supabase
      .from('usuarios')
      .update({ favoritos: user.favoritos })
      .eq('id', user.id);
  
    if (error) {
      console.error('Error al eliminar de favoritos:', error.message);
      throw new Error('Error al eliminar de favoritos');
    }
  
    return { ...user, favoritos: user.favoritos };
  }
}