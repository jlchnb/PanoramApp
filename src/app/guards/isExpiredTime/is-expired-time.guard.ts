import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

export const isExpiredTimeGuard: CanActivateFn = async (route, state) => {


  const _authService = inject(AuthServiceService)

  const router = inject(Router)

  const userTimeExpired = await _authService.isDateExpired()

  if(userTimeExpired){
    return true
  }

  router.navigate(['/login']);
  return false;
};
