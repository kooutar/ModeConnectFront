import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';

export interface ReviewRequestDto {
  clientId: number;
  orderId: number;
  comment: string;
  rate: number;
}

export interface ReviewResponseDto {
  id: number;
  clientId: number;
  clientName?: string;
  orderId: number;
  comment: string;
  rate: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {}

  createReview(review: ReviewRequestDto): Observable<ReviewResponseDto> {
    // Changement de GET en POST ici
    return this.http.post<ReviewResponseDto>(`${this.apiUrl}client/reviews`, review);
  }

  getReviewsByOrder(orderId: number): Observable<ReviewResponseDto[]> {
    return this.http.get<ReviewResponseDto[]>(`${this.apiUrl}orders/${orderId}/reviews`);
  }

  getReviewsByModel(modelId: number): Observable<ReviewResponseDto[]> {
    return this.http.get<ReviewResponseDto[]>(`${this.apiUrl}models/${modelId}/reviews`);
  }
}
