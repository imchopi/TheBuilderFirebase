import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from './core/services/translate/custom-translate.service';
import { SharedModule } from './shared/shared.module';
import { ClickDirective } from './shared/directives/click.directive';
import { UppercasePipe } from './shared/pipes/Uppercase/uppercase.pipe';
import { environment } from 'src/environments/environment';


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
      // Inyecta en el módulo principal el firebaseConfig
      provide: 'firebase-config',useValue:environment.firebaseConfig
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
