import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { FakeService } from './fake.service';

export class AuthInterceptor implements HttpInterceptor {

  constructor(/*protected tokenService: TokenService,*/
        /* protected auth: AuthService */
        protected fake: FakeService
        ) {
    console.log(`AuthInterceptor.constructor()`);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('auth interceptor is working');
    const token = ''; // this.tokenService.token;
    if (token && req.url.startsWith('/')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(req).pipe(
        tap(
          resp => {
            console.log(`interceptor is scanning result: ${resp}`);
          },
          error => {
            if (error.status === 401 && req.url.startsWith('/')) {
              console.log('signal login is required');
              // this.auth.login();
            }
          }
        )
      );
    }
  }
}
