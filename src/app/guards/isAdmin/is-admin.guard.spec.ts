import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAdminGuard } from './is-admin.guard';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [isAdminGuard], // Aplica el guard para proteger esta ruta
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  // Otras rutas...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}