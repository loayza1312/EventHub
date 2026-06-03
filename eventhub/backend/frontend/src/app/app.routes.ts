import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // 🌍 ROTTE PUBBLICHE
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },

  // 👤 AREA UTENTE AUTENTICATO
  {
    path: 'my-tickets',
    loadComponent: () => import('./pages/my-tickets/my-tickets').then(m => m.MyTickets),
    canActivate: [roleGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.Profile),
    canActivate: [roleGuard]
  },

  // 🏢 AREA ORGANIZZATORE
  {
    path: 'organizer/dashboard',
    loadComponent: () => import('./pages/organizer/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [roleGuard]
  },

  // 👑 AREA AMMINISTRATORE
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [roleGuard]
  },

  // 🔄 WILDCARD
  {
    path: '**',
    redirectTo: ''
  }
];