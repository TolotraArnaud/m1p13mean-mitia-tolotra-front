import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  console.log('AuthGuard check - token:', token);
  console.log('AuthGuard check - user:', localStorage.getItem('user'));

  if (token) {
    const allowedRoles = route.data?.['roles'] as string[] | undefined;

    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).role : null;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return router.createUrlTree(['/']);
      }
    }
    return true; // autorisé
  }


  // sinon redirection
  return router.createUrlTree(['/login']);
  // return true;
};
