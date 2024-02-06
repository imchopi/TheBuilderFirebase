import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomTranslateService } from './core/services/translate/custom-translate.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  
  constructor(
    private _auth: AuthService,
    private router: Router,
    public translate: CustomTranslateService,
    ) {
      this.checkAuthentication();
    }
    
    async checkAuthentication() {
      try {
        const user = await this._auth.me();
        if (user) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/loading']);
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        // Aquí puedes manejar el error si es necesario
      }
    }

}
