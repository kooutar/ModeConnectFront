import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Model } from '../interfaces/Model';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'models'; // adjust path if backend differs

  getAllModels(): Observable<Model[]> {
    // include credentials so server can validate session/cookies
    return this.http.get<Model[]>(this.baseUrl);
  }

  getModelById(id: number): Observable<Model> {
    // Get a specific model by ID with credentials
    return this.http.get<Model>(`${this.baseUrl}/${id}`);
  }
}
