import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { Logout } from './core/services/logout/logout';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'logout', component: Logout},
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard], data: { roles: ['admin'] } },
];
