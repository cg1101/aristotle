import { Injectable } from '@angular/core';

@Injectable()
export class FakeService {
  constructor() {
    console.log('FakeService.constructor()');
  }
}
