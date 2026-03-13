import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isBrowser = typeof window !== 'undefined';
  const router = inject(Router);

  let authReq = req;

  if (isBrowser) {
    const token = window.localStorage.getItem('token');

    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isBrowser && (error.status === 401 || error.status === 403)) {
        // JWT expiré ou non valide : on nettoie le stockage et on redirige vers le login
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('refreshToken');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
