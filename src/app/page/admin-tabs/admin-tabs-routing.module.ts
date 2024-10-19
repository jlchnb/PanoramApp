import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminTabsPage } from './admin-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: AdminTabsPage,
    children: [
      {
        path: 'usuarios',
        loadChildren: () => import('../lista-usuarios/lista-usuarios.module').then(m => m.ListaUsuariosPageModule)
      },
      {
        path: 'eventos',
        loadChildren: () => import('../lista-eventos/lista-eventos.module').then(m => m.ListaEventosPageModule)
      },
      {
        path: '',
        redirectTo: '/admin-tabs/usuarios',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTabsPageRoutingModule {}