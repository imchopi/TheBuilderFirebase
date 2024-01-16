import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuildFormPage } from './build-form.page';

const routes: Routes = [
  {
    path: '',
    component: BuildFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildFormPageRoutingModule {}
