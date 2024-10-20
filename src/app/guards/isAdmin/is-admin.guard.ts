import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

export const isAdminGuard: CanActivateFn = async (route, state) => {

  const _authService = inject(AuthServiceService);
  const router = inject(Router);

  // Obtiene la información del usuario desde el AuthService
  const userInfo = await _authService.getDecryptedUserData();

  // Verifica si el rol del usuario es 'admin'
  if (userInfo?.role === 'admin') {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
