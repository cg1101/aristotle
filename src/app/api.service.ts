import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(protected http: HttpClient) {
    console.log('ApiService.constructor()');
  }

  whoAmI(): Observable<any> {
    return of(null).pipe(
      switchMap(() => {
        return this.http.get('/whoami').pipe(
          switchMap(a => of(a)),
          catchError(error => {
            if (error.status === 404) {
              error.status = 401;
              return throwError(error);
            }
          })
        );
      }),
    );
  }
}
