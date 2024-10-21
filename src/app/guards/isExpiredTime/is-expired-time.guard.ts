import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

export const isExpiredTimeGuard: CanActivateFn = async (route, state) => {
  const _authService = inject(AuthServiceService);
  const router = inject(Router);

  const userData = await _authService.getDecryptedUserData();

  if (userData?.role === 'anonymous') {
    return true;
  }

  const userTimeExpired = await _authService.isDateExpired();

  if (!userTimeExpired) {
    console.log("Sesión válida");
    return true;
  }

  console.log("Sesión expirada, redirigiendo a /welcome");
  router.navigate(['/welcome']);
  return false;
};