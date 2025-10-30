import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom, map, take } from 'rxjs';

/**
 * Guard de rutas para impedir que un usuario autenticado vuelva a las pantallas públicas.
 *
 * Este guard se aplica típicamente a rutas como `/login`, `/register` o al flujo
 * inicial de la app. La lógica es:
 *
 * - Se obtiene el estado de autenticación de Firebase.
 * - Si el usuario **ya está logueado** y la ruta **no** es parte del onboarding,
 *   se lo redirige automáticamente a `/home`.
 * - Si **no** está logueado, o si está en pleno onboarding, se permite el acceso (`true`).
 *
 * Esto evita que un usuario autenticado pueda volver a la pantalla de login/registro.
 *
 * @param {ActivatedRouteSnapshot} route - Información de la ruta que se intenta activar.
 * @param {RouterStateSnapshot} state - Estado actual del router, usado para conocer la URL.
 * @returns {Observable<boolean | UrlTree>} `true` para permitir el acceso o un `UrlTree` para redirigir.
 */
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
