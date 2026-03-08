import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (typeof window !== 'undefined') {

    const token = window.localStorage.getItem('token');

    if (token) {
      const reqClone = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      return next(reqClone);
    }
  }

  return next(req);
};
