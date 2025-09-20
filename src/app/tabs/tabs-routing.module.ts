import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'create-acc',
        loadChildren: () => import('../create-acc/create-acc.module').then(m => m.CreateAccPageModule)
      },
      {
        path: 'login-nutrifit',
        loadChildren: () => import('../login-nutrifit/login-nutrifit.module').then(m => m.LoginNutrifitPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
