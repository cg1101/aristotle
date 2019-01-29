import { Injectable, Inject } from '@angular/core';
import { LocalStorage } from './local-storage';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  token: string = null;
  constructor(@Inject(LocalStorage) protected localStorage) {
    console.log(`TokenService.constructor()`);
    this.token = this.localStorage.getItem('aristotle');
  }
}
