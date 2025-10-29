import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom, map, take } from 'rxjs';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const isOnboarding =
    state.url.startsWith('/about-you') ||
    state.url.startsWith('/objective');

  return authState(auth).pipe(
    take(1),
    map(user => (user && !isOnboarding) ? router.createUrlTree(['/home']) : true)
  );
};
