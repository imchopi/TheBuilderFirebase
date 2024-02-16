import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isLogged$.pipe(      
      map((logged) => {
        console.log("Estado del logueo: " + logged);
        if (logged !== null) {
          // Si el estado de autenticación ya está determinado
          if (logged) {
            // Si el usuario está autenticado, permitir el acceso a la ruta protegida
            return true;
          } else {
            // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
            return this.router.createUrlTree(['/login']);
          }
        } else {
          // Si el estado de autenticación aún no está determinado, redirigir a la página de carga
          return this.router.createUrlTree(['/loading']);
        }
      })
    );
  }
}
