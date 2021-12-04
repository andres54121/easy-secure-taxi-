import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./auth/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./auth/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule),
    // Manera de solo ingresar si esta logueado
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/update/:uid',
    loadChildren: () => import('./user/update/update.module').then( m => m.UpdatePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () => import('./user/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'mapa',
    loadChildren: () => import('./mapa/mapa.module').then( m => m.MapaPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'message',
    loadChildren: () => import('./user/message/message.module').then( m => m.MessagePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'select-taxi/:uid',
    loadChildren: () => import('./select-taxi/select-taxi.module').then( m => m.SelectTaxiPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'ruta-mapa',
    loadChildren: () => import('./ruta-mapa/ruta-mapa.module').then( m => m.RutaMapaPageModule),
    canActivate: [AuthGuard],
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
