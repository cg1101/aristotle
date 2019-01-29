import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(protected http: HttpClient) {
    console.log('ApiService.constructor()');
   }

  whoAmI(): Observable<any> {
    return this.http.get('/whoami').pipe(
      switchMap(a => of(a)),
    );
  }
}
