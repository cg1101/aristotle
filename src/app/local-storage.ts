import { InjectionToken } from '@angular/core';

export const LocalStorage = new InjectionToken('localStorage');

export function getLocalStorage() {
  return (typeof window !== 'undefined') ? window.localStorage : null;
}
