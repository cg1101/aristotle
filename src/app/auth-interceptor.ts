import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(protected auth: AuthService) {
    console.log('AuthInterceptor.constructor()');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.token;
    const isMatchingUrl = req.url.startsWith('/');

    if (token && isMatchingUrl) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      tap(resp => resp, error => {
        console.error('interceptor detected error', error);
        if (error.status === 404 && isMatchingUrl) {
          this.auth.login();
        }
      })
    );
  }
}
