import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { OrderResponseDto } from '../interfaces/OrderResponseDto';

@Injectable({
  providedIn: 'root',
})
export class CreatorOrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'creator/order';

  getAllOrders(): Observable<OrderResponseDto[]> {
    return this.http.get<OrderResponseDto[]>(this.baseUrl);
  }

  acceptOrder(orderId: number): Observable<OrderResponseDto> {
    return this.http.put<OrderResponseDto>(`${this.baseUrl}/${orderId}/accept`, {});
  }

  rejectOrder(orderId: number): Observable<OrderResponseDto> {
    return this.http.put<OrderResponseDto>(`${this.baseUrl}/${orderId}/reject`, {});
  }
}
