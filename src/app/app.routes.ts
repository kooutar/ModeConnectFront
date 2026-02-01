import { Routes } from '@angular/router';
import { RegistrationComponent } from './features/auth/pages/registration-component/registration-component';
import { LoginComponent } from './features/auth/pages/login-component/login-component';

export const routes: Routes = [
    {
        path: '',
        component:RegistrationComponent
    },
    {
      
        path: 'login',
        component:LoginComponent
    }
];
