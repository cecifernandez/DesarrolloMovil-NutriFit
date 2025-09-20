import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'create-acc',
    loadChildren: () => import('./create-acc/create-acc.module').then( m => m.CreateAccPageModule)
  },  {
    path: 'login-nutrifit',
    loadChildren: () => import('./login-nutrifit/login-nutrifit.module').then( m => m.LoginNutrifitPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
