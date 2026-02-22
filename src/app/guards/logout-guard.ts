import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const logoutGuard: CanActivateFn = (route, state) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  const router = inject(Router);
  return router.createUrlTree(['/login']);
};
