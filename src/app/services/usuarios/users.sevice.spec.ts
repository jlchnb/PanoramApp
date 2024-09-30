import { TestBed } from '@angular/core/testing';

// Asegúrate de que la ruta de importación sea correcta
import { UsersService } from '../../services/usuarios/users.service'; // Cambia a la ruta correcta

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
