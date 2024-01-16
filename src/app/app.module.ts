import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientProvider } from './core/services/http-client/http-client.provider';
import { AuthService } from './core/services/auth/auth.service';
import { JwtService } from './core/services/jwt/jwt.service';
import { ApiService } from './core/services/api/api.service';
import { AuthStrapiService } from './core/services/auth-strapi/auth-strapi.service';
import { HttpClientWebProvider } from './core/services/http-client-web/http-client-web.provider';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from './core/services/translate/custom-translate.service';
import { SharedModule } from './shared/shared.module';
import { ClickDirective } from './shared/directives/click.directive';
import { UppercasePipe } from './shared/pipes/Uppercase/uppercase.pipe';

export function httpProviderFactory(http: HttpClient) {
  return new HttpClientWebProvider(http);
}

export function AuthServiceProvider(jwt: JwtService, api: ApiService) {
  return new AuthStrapiService(jwt, api);
}

@NgModule({
  declarations: [AppComponent, UppercasePipe],
  imports: [
    SharedModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HttpClientProvider,
      deps: [HttpClient, Platform],
      useFactory: httpProviderFactory,
    },
    {
      provide: AuthService,
      deps: [JwtService, ApiService],
      useFactory: AuthServiceProvider,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
