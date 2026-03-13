import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { Observable, Subject } from 'rxjs';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface Message {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string; 
  isRead?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private baseUrl = environment.apiUrl + 'messages'; 
  private wsUrl = 'http://localhost:8080/ws'; 

  private stompClient: any;
  private messageSubject = new Subject<Message>();

  /**
   * Initialize WebSocket connection.
   */
  initWebSocket(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const socket = new SockJS(this.wsUrl);
      this.stompClient = Stomp.Stomp.over(socket);

      const token = localStorage.getItem('token');
      
      this.stompClient.connect({ 'Authorization': 'Bearer ' + token }, (frame: any) => {
        console.log('Connected to WebSocket: ' + frame);
        
        this.stompClient.subscribe('/user/queue/messages', (message: any) => {
          if (message.body) {
            this.messageSubject.next(JSON.parse(message.body));
          }
        });
      }, (error: any) => {
        console.error('WebSocket connection error: ', error);
      });
    } catch (e) {
      console.error('Error initializing WebSocket', e);
    }
  }

  /**
   * Observable for incoming real-time messages.
   */
  getIncomingMessages(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  /**
   * Fetches the conversation with a specific user.
   */
  getConversation(partnerId: number): Observable<Message[]> {
     return this.http.get<Message[]>(`${this.baseUrl}/conversation/${partnerId}`);
  }

  /**
   * Sends a new message via REST (backend then pushes via WS).
   */
  sendMessage(message: { receiverId: number, content: string }): Observable<Message> {
      return this.http.post<Message>(this.baseUrl, message);
  }

  /**
   * Gets the count of unread messages for the current user.
   */
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unread/count`);
  }

  /**
   * Clean up connection.
   */
  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect();
    }
  }
}
