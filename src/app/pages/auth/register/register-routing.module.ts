import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPage } from './register.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@/app/pages/onboarding/signup/start.module').then(
            (m) => m.StartPageModule
          ),
      },
      {
        path: 'about-person',
        loadChildren: () =>
          import('@/app/pages/onboarding/about-you/about-you.module').then(
            (m) => m.AboutYouModule
          ),
      },
      {
        path: 'objective-person',
        loadChildren: () =>
          import('@/app/pages/onboarding/objective/objective.module').then(
            (m) => m.ObjectivePageModule
          ),
      },
      {
        path: 'routines-person',
        loadChildren: () =>
          import('@/app/pages/onboarding/know-you/rutins/rutins.module').then(
            (m) => m.RutinsPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPageRoutingModule {}