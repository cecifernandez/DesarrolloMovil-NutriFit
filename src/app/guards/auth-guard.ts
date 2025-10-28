import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);

  return afAuth.authState.pipe(
    take(1),
    map(user => {
      if (user) {
        // Usuario autenticado → puede acceder
        return true;
      } else {
        // No autenticado → redirigir al welcome
        router.navigate(['/']);
        return false;
      }
    })
  );
};

