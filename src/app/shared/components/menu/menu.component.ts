import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() nickname: UserInfo | string = 'Chopito';
  @Input() languages: string[] = ['es', 'en'];
  @Input() languageSelected: string = 'es';

  currentPage: string = 'login';

  private _user = new BehaviorSubject<UserInfo | null>(null);
  public user$ = this._user.asObservable();

  constructor(
    private _auth: AuthService,
    private _menu: MenuController,
    private _router: Router,
    private _lang: TranslateService
  ) {}
  ngOnInit(): void {
    this._auth.isLogged$.subscribe(async (logged) => {
      if (logged) {
        const user = await this._auth.me();
        this._user.next(user);
        this.home();
      }
    });

    this._lang.use('es');
  }

  navigateToPage(page: string) {
    this.currentPage = page;
    this._router.navigate([page]);
    this._menu.close();
  }

  about() {
    this.navigateToPage('about');
  }

  home() {
    this.navigateToPage('home');
  }

  build() {
    this.navigateToPage('build-info');
  }

  item() {
    this.navigateToPage('item');
  }

  login() {
    this.navigateToPage('login');
  }

  signUp() {
    this.navigateToPage('signup');
  }

  async logout() {
    try {
      await this._auth.logout();
      this.navigateToPage('login');
      this._user.next(null);
    } catch (error) {
      // Manejar el error en caso de que ocurra un problema durante el cierre de sesión
      console.error('Error al cerrar sesión:', error);
      // Aquí puedes mostrar un mensaje de error al usuario si es necesario
    }
  }

  setLanguage(lang: string) {
    this.languageSelected = lang;
    this._lang.use(lang);
  }
}
