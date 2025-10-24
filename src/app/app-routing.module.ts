import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import(
  //       './pages/start-nutri-fit/start-nutri-fit.module'
  //     ).then((m) => m.StartNutriFitPageModule),
  // },
  {
    path: '',
    loadChildren: () =>
      import(
        './pages/onboarding/welcome-nutri-fit/welcome-nutri-fit.module'
      ).then((m) => m.WelcomeNutriFitPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import(
        './pages/auth/login/login.module'
      ).then((m) => m.LogInPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import(
        './pages/auth/register/register.module'
      ).then((m) => m.RegisterPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import(
        './pages/auth/forgot-password/forgot-password.module'
      ).then((m) => m.ForgotPasswordPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import(
        './pages/main/home/home.module'
      ).then((m) => m.HomePageModule),
  },
  {
    path: 'routines',
    loadChildren: () =>
      import(
        './pages/main/routines/routines.module'
      ).then((m) => m.RoutinesPageModule),
  },
  {
    path: 'foods',
    loadChildren: () =>
      import(
        './pages/main/food/food.module'
      ).then((m) => m.FoodPageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import(
        './pages/main/profile/profile.module'
      ).then((m) => m.ProfilePageModule),
  },

  {
    path: 'about-you',
    loadChildren: () =>
      import('./pages/onboarding/about-you/about-you.module').then(
        (m) => m.AboutYouModule
      ),
  },
  {
    path: 'objective',
    loadChildren: () => import('./pages/onboarding/objective/objective.module').then( m => m.ObjectivePageModule)
  },
  // {
  //   path: 'progress',
  //   loadChildren: () =>
  //     import(
  //       './pages/extras/progress/progress.module'
  //     ).then((m) => m.ProgressPageModule),
  // },
  // {
  //   path: 'settings',
  //   loadChildren: () =>
  //     import(
  //       './pages/extras/settings/settings.module'
  //     ).then((m) => m.SettingsPageModule),
  // },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
