import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { WindowRef } from './window-ref';
import { FakeService } from './fake.service';

const url =
  'https://superheros.auth.ap-southeast-2.amazoncognito.com/login' +
  '?response_type=token&client_id=6krlht3mucl0oab4jlirli7p37&redirect_uri=http://localhost:8080';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aristotle';

  constructor(protected auth: AuthService, protected win: WindowRef, protected fake: FakeService) {
    console.log(`AppComponent.constructor()`);
  }

  ngOnInit() {
    this.auth.shouldLogin.subscribe(() => {
      this.win.nativeWindow.location.href = url;
    });
  }
}
