import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // guard runs both on server and client; localStorage is client-only
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  const isLoggedIn = isBrowser ? localStorage.getItem('token') : null;

  if (isBrowser && isLoggedIn) {
    return true;
  } else if (!isBrowser) {
    // during SSR allow navigation (token check happens on client)
    return true;
  } else {
    // client & not logged in
    router.navigate(['/login']);
    return false;
  }
};
