import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom } from 'rxjs';

export const noAuthGuard: CanActivateFn = async () => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);

  const user = await firstValueFrom(afAuth.authState);

  // Si el usuario está logueado → lo mandamos al home
  if (user) {
    router.navigateByUrl('/home', { replaceUrl: true });
    return false;
  }

  // Si no hay usuario, puede entrar normalmente
  return true;
};

