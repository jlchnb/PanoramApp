import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { EventosService } from '../services/eventos/eventos.service';
import { Evento } from '../models/Evento';
import { Usuario } from '../models/Usuario';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { UsersService } from '../services/usuarios/users.service';
import { Storage } from '@ionic/storage-angular';

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
    this.loggedUser = JSON.parse(sessionStorage.getItem('userkey') || '{}' );
    if (!this.loggedUser.favoritos) {
      this.loggedUser.favoritos = [];  // Inicializa favoritos si no existe
    }
    console.log('Usuario logueado:', this.loggedUser);
    this.updateWeekLabels();
    await this.cargarEventos();
    
    const loading = await this.loadingController.create({
        message: 'Cargando datos...',
        spinner: 'circles',
    });
    await loading.present();

    try {
      this.updateEventos();
      this.eventosFiltrados = this.eventosSemanaActual;
    } catch (error) {
        console.error('Error al obtener eventos:', error);
    } finally {
        loading.dismiss();
    }
  }

  async loadEventos() {
    this.eventos = await this.eventosService.obtenerEventos();
  }

  async addToFavorites(eventoId: number) {
    this.loggedUser = await this.usersService.addToFavorites(this.loggedUser, eventoId);
  }

  async removeFromFavorites(eventoId: number) {
    this.loggedUser = await this.usersService.removeFromFavorites(this.loggedUser, eventoId);
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
    const targetDate = new Date(date); // Clonamos la fecha para evitar modificar la original
    const day = targetDate.getDay(); // Día actual (0=Domingo, ..., 6=Sábado)
    const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1) + offset; // Ajuste para iniciar en lunes
    const start = new Date(targetDate.setDate(diff));
    start.setHours(0, 0, 0, 0); // Reinicia hora a las 00:00:00
    return start;
  }
  
  endOfWeek(start: Date): Date {
    const end = new Date(start); // Clonamos la fecha de inicio
    end.setDate(start.getDate() + 6); // Suma 6 días para llegar al domingo
    end.setHours(23, 59, 59, 999); // Establece la hora final del día
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
    // Semana actual
    const inicioSemanaActual = this.startOfWeek(new Date());
    const finSemanaActual = this.endOfWeek(inicioSemanaActual);
  
    // Próxima semana
    const inicioProximaSemana = this.startOfWeek(new Date(), 7);
    const finProximaSemana = this.endOfWeek(inicioProximaSemana);
  
    // Subsiguiente semana
    const inicioSubsiguienteSemana = this.startOfWeek(new Date(), 14);
    const finSubsiguienteSemana = this.endOfWeek(inicioSubsiguienteSemana);
  
    // Filtrar eventos por semana
    this.eventosSemanaActual = this.filtrarEventosPorSemana(inicioSemanaActual, finSemanaActual);
    this.eventosProximaSemana = this.filtrarEventosPorSemana(inicioProximaSemana, finProximaSemana);
    this.eventosSubsiguienteSemana = this.filtrarEventosPorSemana(inicioSubsiguienteSemana, finSubsiguienteSemana);
  
    // Debug: Imprimir semanas y sus eventos
    console.log('Semana actual:', { inicio: inicioSemanaActual, fin: finSemanaActual });
    console.log('Próxima semana:', { inicio: inicioProximaSemana, fin: finProximaSemana });
    console.log('Subsiguiente semana:', { inicio: inicioSubsiguienteSemana, fin: finSubsiguienteSemana });
  
    // Actualizar etiquetas
    this.currentWeek = `Semana del ${inicioSemanaActual.toLocaleDateString()} al ${finSemanaActual.toLocaleDateString()}`;
    this.nextWeek = `Semana del ${inicioProximaSemana.toLocaleDateString()} al ${finProximaSemana.toLocaleDateString()}`;
    this.followingWeek = `Semana del ${inicioSubsiguienteSemana.toLocaleDateString()} al ${finSubsiguienteSemana.toLocaleDateString()}`;
  }

  filtrarEventosPorSemana(inicioSemana: Date, finSemana: Date): Evento[] {
    return this.eventos.filter(evento => {
      // Verificamos que evento.fecha es un objeto Date
      if (!(evento.fecha instanceof Date)) {
        console.error('Fecha inválida en el evento:', evento);
        return false;
      }
  
      const fechaEvento = evento.fecha; // Si ya es un Date, la puedes usar directamente
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

  toggleFavorite(evento: any): void {
    if (Array.isArray(this.loggedUser?.favoritos)) {
      const index = this.loggedUser.favoritos.indexOf(evento.id);
      if (index === -1) {
        this.loggedUser.favoritos.push(evento.id);
      } else {
        this.loggedUser.favoritos.splice(index, 1);
      }
  
      localStorage.setItem('favoritos', JSON.stringify(this.loggedUser.favoritos));
    }
  }
}