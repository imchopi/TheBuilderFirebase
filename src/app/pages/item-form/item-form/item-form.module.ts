import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemFormPageRoutingModule } from './item-form-routing.module';

import { ItemFormPage } from './item-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule, 
    ItemFormPageRoutingModule
  ],
  declarations: [ItemFormPage]
})
export class ItemFormPageModule {}
