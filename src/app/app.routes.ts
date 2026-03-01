import { Routes } from '@angular/router';
import { RegistrationComponent } from './features/auth/pages/registration-component/registration-component';
import { LoginComponent } from './features/auth/pages/login-component/login-component';
import { HomeComponent } from './features/home/pages/home-component/home-component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegistrationComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
