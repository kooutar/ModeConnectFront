import { Routes } from '@angular/router';
import { RegistrationComponent } from './features/auth/pages/registration-component/registration-component';
import { LoginComponent } from './features/auth/pages/login-component/login-component';
import { HomeComponent } from './features/home/pages/home-component/home-component';
import { ClientDashboardComponent } from './features/client/pages/client-dashboard/client-dashboard';
import { ModelListComponent } from './features/client/pages/model-list/model-list.component';
import { ModelDetailComponent } from './features/client/pages/model-detail/model-detail.component';
import { authGuard } from './core/guards/auth-guard';
import { CreatorDashboard } from './features/creator/creator-dashboard/creator-dashboard';

import { CreatorOrdersComponent } from './features/creator/creator-orders/creator-orders.component';

import { CreatorModelDetailComponent } from './features/creator/creator-model-detail/creator-model-detail.component';
import { CreatorStatisticsComponent } from './features/creator/creator-statistics/creator-statistics.component';
import { ClientOrdersComponent } from './features/client/pages/client-orders/client-orders.component';
import { ServiceComponent } from './features/service/service.component';
import { BlogComponent } from './features/blog/blog.component';

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
    path: 'orders',
    component: ClientOrdersComponent,
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
  {
    path:'creator',
    component:CreatorDashboard,
    canActivate: [authGuard],
  },
  {
    path: 'creator/orders',
    component: CreatorOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'creator/models/:id',
    component: CreatorModelDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'creator/statistics',
    component: CreatorStatisticsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'services',
    component: ServiceComponent,
  },
  {
    path: 'blog',
    component: BlogComponent,
  }
];
