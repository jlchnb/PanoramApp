import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

export const isAdminGuard: CanActivateFn = async (route, state) => {
  const _authService = inject(AuthServiceService);
  const router = inject(Router);

  const userInfo = await _authService.getDecryptedUserData();

  if (userInfo?.role === 'admin') {
    return true;
  } else if (userInfo?.role === 'user' || userInfo?.role === 'anonymous') {
    router.navigate(['/home']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};