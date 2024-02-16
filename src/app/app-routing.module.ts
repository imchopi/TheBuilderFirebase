import { NgModule, inject } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    /*canActivate: [AuthGuard],*/
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'build-info',
    loadChildren: () =>
      import('./pages/build-info/build-info.module').then(
        (m) => m.BuildInfoPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'item',
    loadChildren: () =>
      import('./pages/item/item.module').then((m) => m.ItemPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./pages/about/about.module').then((m) => m.AboutPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'build-form',
    loadChildren: () =>
      import('./pages/build-form/build-form.module').then(
        (m) => m.BuildFormPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'build/update/:buildId',
    loadChildren: () =>
      import('./pages/build-form/build-form.module').then(
        (m) => m.BuildFormPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'item-form',
    loadChildren: () =>
      import('./pages/item-form/item-form/item-form.module').then(
        (m) => m.ItemFormPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'item/update/:itemId',
    loadChildren: () =>
      import('./pages/item-form/item-form/item-form.module').then(
        (m) => m.ItemFormPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'loading',
    loadChildren: () =>
      import('./pages/loading/loading.module').then((m) => m.LoadingPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
