import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./start-nutri-fit/start-nutri-fit.module').then(m =>  m.StartNutriFitPageModule)
  },
  {
    path: 'welcolme-nutri-fit',
    loadChildren: () => import('./welcolme-nutri-fit/welcolme-nutri-fit.module').then(m => m.WelcolmeNutriFitPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
