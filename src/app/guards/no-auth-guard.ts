import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

export const noAuthGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = await firstValueFrom(authState(auth));

  // Si el usuario está logueado → redirigir al home
  if (user) {
    // Recomendado: devolver un UrlTree (sin efectos secundarios en el guard)
    return router.createUrlTree(['/home']);
  }

  // Si no hay usuario, puede entrar normalmente
  return true;
};
