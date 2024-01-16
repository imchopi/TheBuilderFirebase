import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() nickname: User | string = 'Chopito';
  @Input() languages: string[] = ['es', 'en'];
  @Input() languageSelected: string = 'es';

  currentPage: string = 'login';

  private _user = new BehaviorSubject<User | null>(null);
  public user$ = this._user.asObservable();

  constructor(
    private _menu: MenuController,
    private _router: Router,
    private _auth: AuthService,
    private _lang: TranslateService
  ) {}
  ngOnInit(): void {
    this._auth.isLogged$.subscribe((logged) => {
      if (logged) {
        this._auth.me().subscribe((user) => {
          this._user.next(user);
        });
        this.home()
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

  logout() {
    this._auth.logout().subscribe((_) => {
      this.navigateToPage('login');
      this._user.next(null)
    });
  }

  setLanguage(lang: string) {
    this.languageSelected = lang;
    this._lang.use(lang);
  }
}
