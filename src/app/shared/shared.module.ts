import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterComponent } from './components/register/register.component';
import { MenuComponent } from './components/menu/menu.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader } from '../core/services/translate/custom-translate.service';
import { BuildFormAddComponent } from './components/build-form/build-form-add.component';
import { ItemFormAddComponent } from './components/item-form/item-form/item-form-add.component';
import { FormControlComponent } from './components/form-control/form-control.component';
import { AboutModalComponent } from './components/about-modal/about-modal.component';
import { ClickDirective } from './directives/click.directive';

@NgModule({
  declarations: [
    ClickDirective,
    AboutModalComponent,
    FormControlComponent,
    ItemFormAddComponent,
    BuildFormAddComponent,
    MenuComponent,
    LoginFormComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    ClickDirective,
    AboutModalComponent,
    FormControlComponent,
    ItemFormAddComponent,
    BuildFormAddComponent,
    ReactiveFormsModule,
    MenuComponent,
    LoginFormComponent,
    RegisterComponent,
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule,
  ],
})
export class SharedModule {}
