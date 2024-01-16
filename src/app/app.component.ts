import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { User } from './core/interfaces/user';
import { ApiService } from './core/services/api/api.service';
import { CustomTranslateService } from './core/services/translate/custom-translate.service';

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
    this._auth.isLogged$.subscribe((logged) => {
      if (logged) {
        this._auth.me().subscribe((user) => {
          this.router.navigate(['/home'])
        });
      } else {
        this.router.navigate(['/loading'])
      }
    });
  }

}
