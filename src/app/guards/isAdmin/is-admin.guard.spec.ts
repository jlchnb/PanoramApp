import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAdminGuard } from './is-admin.guard';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [isAdminGuard], // Aplica el guard para proteger esta ruta
    loadChildren: () => import('../../page/admin-tabs/admin-tabs.module').then(m => m.AdminTabsPageModule)
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