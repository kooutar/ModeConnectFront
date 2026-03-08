import { Routes } from '@angular/router';
import { RegistrationComponent } from './features/auth/pages/registration-component/registration-component';
import { LoginComponent } from './features/auth/pages/login-component/login-component';
import { HomeComponent } from './features/home/pages/home-component/home-component';
import { ClientDashboardComponent } from './features/client/pages/client-dashboard/client-dashboard';
import { ModelListComponent } from './features/client/pages/model-list/model-list.component';
import { ModelDetailComponent } from './features/client/pages/model-detail/model-detail.component';
import { authGuard } from './core/guards/auth-guard';

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
  {
    path: 'dashboard',
    component: ClientDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'models',
    component: ModelListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'models/:id',
    component: ModelDetailComponent,
    canActivate: [authGuard],
  },
];
