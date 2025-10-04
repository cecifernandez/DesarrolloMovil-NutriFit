import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/start-nutri-fit/start-nutri-fit.module').then(m =>  m.StartNutriFitPageModule)
  },
  {
    path: 'welcome-nutri-fit',
    loadChildren: () => import('./pages/onboarding/welcome-nutri-fit/welcome-nutri-fit.module').then(m => m.WelcolmeNutriFitPageModule)
  },
  {
    path: 'create-acc',
    loadChildren: () => import('./pages/auth/create-acc/create-acc.module').then(m => m.CreateAccPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/main/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/main/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'fitness',
    loadChildren: () => import('./pages/main/fitness/fitness.module').then( m => m.FitnessPageModule)
  },
  {
    path: 'food',
    loadChildren: () => import('./pages/main/food/food.module').then( m => m.FoodPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/main/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'progress',
    loadChildren: () => import('./pages/extras/progress/progress.module').then( m => m.ProgressPageModule)
  },
  {
    path: 'settings', 
    loadChildren: () => import('./pages/extras/settings/settings.module').then( m => m.SettingsPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
