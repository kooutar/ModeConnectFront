import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../interfaces/RegistreRequest';
import { LoginRequest } from '../interfaces/LoginRequest';
import { LoginResponse } from '../interfaces/responses/LoginResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    urlRegistre=environment.apiUrl + 'auth/register';
    urlLogin=environment.apiUrl + 'auth/login';
    private httpClient=inject(HttpClient);
    register(data:RegisterRequest){
        return this.httpClient.post<string>(this.urlRegistre,data);
    }
    login(data:LoginRequest){
        return this.httpClient.post<LoginResponse>(this.urlLogin, data ,{withCredentials: true});
    }
}
