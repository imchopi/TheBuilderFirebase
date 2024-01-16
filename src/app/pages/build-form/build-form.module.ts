import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuildFormPageRoutingModule } from './build-form-routing.module';

import { BuildFormPage } from './build-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [SharedModule, BuildFormPageRoutingModule],
  declarations: [BuildFormPage],
})
export class BuildFormPageModule {}
