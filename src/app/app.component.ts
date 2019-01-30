import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { WindowRef } from './window-ref';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

const url =
  'https://superheros.auth.ap-southeast-2.amazoncognito.com/login' +
  '?response_type=token&client_id=6krlht3mucl0oab4jlirli7p37&redirect_uri=http://localhost:8080';

function decodeFragment(input = ''): Object {
  const rs = {};
  input.replace(/\+/g, ' ').split(/&/).forEach(kv => {
    const i = kv.indexOf('=');
    if (i > 0) {
      const k = kv.slice(0, i);
      const v = kv.slice(i + 1);
      rs[k] = v;
    }
  });
  return rs;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  ngDestroy$ = new Subject<void>();

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected auth: AuthService,
    protected win: WindowRef
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        first()
      )
      .subscribe((event: NavigationEnd) => {
        const fragment = this.route.snapshot.fragment;
        const rs = decodeFragment(fragment);
        console.log('first NavigationEnd', event);
        console.log('fragment is', fragment);
        console.log('rs', rs);
      });
    this.auth.refreshToken();
    this.auth.shouldLogin.pipe(takeUntil(this.ngDestroy$)).subscribe(() => {
      console.log('show login page');
      this.win.nativeWindow.location.href = url;
    });
  }

  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }
}
