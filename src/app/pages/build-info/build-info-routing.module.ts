import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuildInfoPage } from './build-info.page';

const routes: Routes = [
  {
    path: '',
    component: BuildInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildInfoPageRoutingModule {}
