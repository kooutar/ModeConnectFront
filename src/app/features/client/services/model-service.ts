import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Model } from '../interfaces/Model';
import { ClientOrder } from '../interfaces/ClientOrder';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'models'; // adjust path if backend differs
  private orderUrl = environment.apiUrl + 'client/order'; // endpoint for orders
  private creatorModelsUrl = environment.apiUrl + 'creator/models';

  getAllModels(): Observable<Model[]> {
    // include credentials so server can validate session/cookies
    return this.http.get<Model[]>(this.baseUrl);
  }

  getModelById(id: number): Observable<Model> {
    // Get a specific model by ID with credentials
    return this.http.get<Model>(`${this.baseUrl}/${id}`);
  }

  createOrder(modelId: number, orderData: any): Observable<any> {
    // Create an order (rental or purchase)
    return this.http.post(`${this.orderUrl}/${modelId}`, orderData);
  }

  getRentedModels(): Observable<Model[]> {
    // Récupérer les modèles loués par l'utilisateur connecté
    return this.http.get<Model[]>(`${this.orderUrl}/rented`);
  }

  getClientOrders(): Observable<ClientOrder[]> {
    // Récupérer toutes les commandes du client connecté
    return this.http.get<ClientOrder[]>(this.orderUrl);
  }

  getCreatorModels(): Observable<Model[]> {
    // Récupérer les modèles du créateur connecté
    return this.http.get<Model[]>(this.creatorModelsUrl);
  }

  createModel(modelData: any): Observable<Model> {
    // Créer un nouveau modèle
    return this.http.post<Model>(this.creatorModelsUrl + '/create', modelData);
  }

  uploadModelMedia(modelId: number, formData: FormData): Observable<any> {
    // Uploader des images/médias pour un modèle spécifique
    return this.http.post(`${this.creatorModelsUrl}/${modelId}/media`, formData);
  }

  updateModel(modelId: number, modelData: any): Observable<Model> {
    // Mettre à jour un modèle existant
    return this.http.put<Model>(`${this.creatorModelsUrl}/${modelId}`, modelData);
  }

  deleteModel(modelId: number): Observable<void> {
    // Supprimer un modèle
    return this.http.delete<void>(`${this.creatorModelsUrl}/${modelId}`);
  }
}
