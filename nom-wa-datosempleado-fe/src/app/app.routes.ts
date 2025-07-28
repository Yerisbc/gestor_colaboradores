import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'colaboradores',
    loadComponent: () => import('./components/colaboradores/colaboradores.component').then(m => m.ColaboradoresComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'colaboradores/nuevo',
    loadComponent: () => import('./components/colaboradores/colaborador-form-simple.component').then(m => m.ColaboradorFormSimpleComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'colaboradores/editar/:id',
    loadComponent: () => import('./components/colaboradores/colaborador-form-simple.component').then(m => m.ColaboradorFormSimpleComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
