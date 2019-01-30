import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { LocalStorage } from './local-storage';
import { ApiService } from './api.service';

export const tokenKey = 'aristotle';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  token: string;
  refreshingToken: BehaviorSubject<boolean> = new BehaviorSubject(false);
  shouldLogin: Subject<void> = new Subject();

  constructor(protected api: ApiService, @Inject(LocalStorage) protected localStorage) {
    console.log('AuthService.constructor()');
    this.token = localStorage.getItem(tokenKey);
  }

  refreshToken() {
    this.refreshingToken.next(true);
    this.api.whoAmI().pipe(
      tap(
        resp => {
          this.token = (resp || {}).token;
        },
        error => {
          console.warn(`error caught inside tap: ${error}`);
          return of({ token: 'faketoken' });
        }
      ),
      catchError(error => {
        console.error(`error validating session: ${error}`, error);
        this.token = null;
        return throwError(error);
      }),
      finalize(() => {
        this.refreshingToken.next(false);
      })
    ).subscribe();
  }

  login() {
    this.shouldLogin.next();
  }
}
