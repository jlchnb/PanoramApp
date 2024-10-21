import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

export const isAdminGuard: CanActivateFn = async (route, state) => {
  const _authService = inject(AuthServiceService);
  const router = inject(Router);

  const userInfo = await _authService.getDecryptedUserData();

  if (userInfo?.role === 'admin') {
    console.log('uno, soy admin')
    return true;
  } else if (userInfo?.role === 'user' || userInfo?.role === 'anonymous') {
    // router.navigate(['/home']);
    // if(router.url !== home) router.navigate(/home)
    console.log(router.url,'dos, yendo al home')
    return false;
  }

  router.navigate(['/login']);
  console.log('tres, vuelta al login')
  return false;
  
};