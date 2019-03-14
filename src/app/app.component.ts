import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { WindowRef } from './window-ref';
import { environment } from '../environments/environment';

function decodeFragment(input = ''): Object {
  const rs = {};
  input = input || '';
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
    console.log('environment is', environment);
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
        this.auth.refreshToken();
      });
    this.auth.shouldLogin.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(() => {
      console.log('show login page');
      this.win.nativeWindow.location.href = environment.loginUrl;
    });
  }

  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }
}
