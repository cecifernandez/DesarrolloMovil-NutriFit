import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Guard de rutas que protege secciones solo para usuarios autenticados.
 *
 * Este guard verifica el estado de autenticación de Firebase:
 * - Si **hay** un usuario logueado (`user` existe), permite la navegación (`true`).
 * - Si **no** hay usuario, genera un `UrlTree` para redirigir a la ruta raíz (`'/'`)
 *   o a la pantalla de login, según cómo esté configurada la app.
 *
 * Se usa típicamente en rutas como `/home`, `/profile`, `/dashboard`, etc.,
 * para evitar que usuarios no autenticados accedan directamente escribiendo la URL.
 *
 * @param {ActivatedRouteSnapshot} route - Ruta que se intenta activar.
 * @param {RouterStateSnapshot} state - Estado actual del router (contiene la URL).
 * @returns {Observable<boolean | UrlTree>} Observable que emite `true` si puede pasar
 * o un `UrlTree` si debe redirigir.
 */
export const authGuard: CanActivateFn = (
  route,
  state
): Observable<boolean | UrlTree> => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map((user) => {
      return user ? true : router.createUrlTree(['/']);
    })
  );
};

