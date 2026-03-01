import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const reqClone = req.clone({
    withCredentials: true
  })
  return next(reqClone);
};
