import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.auth.isLogged$.pipe(
      map((logged) => {
        if (!logged) {
          // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
          return this.router.createUrlTree(['/login']);
        }
        // Si el usuario está autenticado, permitir el acceso a la ruta protegida
        return true;
      })
    );
  }
}
