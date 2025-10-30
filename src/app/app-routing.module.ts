import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { noAuthGuard } from './guards/no-auth-guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [noAuthGuard],
    loadChildren: () =>
      import(
        './pages/onboarding/welcome-nutri-fit/welcome-nutri-fit.module'
      ).then((m) => m.WelcomeNutriFitPageModule),
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadChildren: () =>
      import(
        './pages/auth/login/login.module'
      ).then((m) => m.LogInPageModule),
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadChildren: () =>
      import(
        './pages/auth/register/register.module'
      ).then((m) => m.RegisterPageModule),
  },
  {
    path: 'forgot-password',
    canActivate: [noAuthGuard],
    loadChildren: () =>
      import(
        './pages/auth/forgot-password/forgot-password.module'
      ).then((m) => m.ForgotPasswordPageModule),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () =>
      import(
        './pages/main/home/home.module'
      ).then((m) => m.HomePageModule),
  },
  {
    path: 'routines',
    canActivate: [authGuard],
    loadChildren: () =>
      import(
        './pages/main/routines/routines.module'
      ).then((m) => m.RoutinesPageModule),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
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
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/main/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
