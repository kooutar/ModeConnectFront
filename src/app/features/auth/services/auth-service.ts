import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../interfaces/RegistreRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    url=environment.apiUrl + 'auth/register';
    private httpClient=inject(HttpClient);
    register(data:RegisterRequest){
        return this.httpClient.post<string>(this.url,data);
    }
}
