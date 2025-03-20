import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let username = localStorage.getItem('username');
  let accessToken = localStorage.getItem('accessToken');
  let expiresAt = localStorage.getItem('expiresAt');


  if(!username || !accessToken || !expiresAt) {
    router.navigate(['/login']);
    return true;
  }

  if(typeof expiresAt === 'string') {
    if(Number(expiresAt) < new Date().getTime()) {
      localStorage.clear();
      router.navigate(['/login']);
      return true;
    }
  }

  return true;
};
