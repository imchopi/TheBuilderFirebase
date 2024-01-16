import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemFormPage } from './item-form.page';

const routes: Routes = [
  {
    path: '',
    component: ItemFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemFormPageRoutingModule {}
