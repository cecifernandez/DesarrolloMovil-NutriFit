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
          import('@/app/pages/onboarding/start/start.module').then(
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
      // {
      //   path: 'objective-person',
      //   loadChildren: () =>
      //     import('../../onboarding/objective/objective-person.module').then(
      //       (m) => m.ObjetiveModule
      //     ),
      // },
      // {
      //   path: 'start-point-person',
      //   loadChildren: () =>
      //     import('../../onboarding/start-point-person/start-point-person.module').then(
      //       (m) => m.StartPointPerson
      //     ),
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPageRoutingModule {}