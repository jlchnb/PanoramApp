import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAdminGuard } from './is-admin.guard';
import { isExpiredTimeGuard } from '../isExpiredTime/is-expired-time.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('../../home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'admin',
    canActivate: [isExpiredTimeGuard, isAdminGuard],
    loadChildren: () => import('../../page/admin-tabs/admin-tabs.module').then(m => m.AdminTabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('../../page/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}