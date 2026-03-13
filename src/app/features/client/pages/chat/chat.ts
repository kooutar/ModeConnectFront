import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessagingService, Message } from '../../services/messaging-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="chat-wrapper">
      <!-- Sidebar / Conversations List (Brief version) -->
      <aside class="chat-sidebar">
        <div class="sidebar-header">
          <button routerLink="/dashboard" class="back-btn">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h2>Messages</h2>
        </div>
        <div class="conversation-item active">
          <div class="avatar">
            {{ creatorName.charAt(0) || 'C' }}
          </div>
          <div class="conv-info">
            <p class="name">{{ creatorName || 'Créateur' }}</p>
            <p class="status">En ligne</p>
          </div>
        </div>
      </aside>

      <!-- Main Chat Area -->
      <main class="chat-main">
        <header class="chat-header">
          <div class="creator-info">
            <div class="avatar-sm">
               {{ creatorName.charAt(0) || 'C' }}
            </div>
            <div>
              <h3>{{ creatorName }}</h3>
              <span class="online-indicator">Actif maintenant</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="icon-btn"><span class="material-symbols-outlined">call</span></button>
            <button class="icon-btn"><span class="material-symbols-outlined">videocam</span></button>
            <button class="icon-btn"><span class="material-symbols-outlined">info</span></button>
          </div>
        </header>

        <div class="messages-container" #scrollContainer>
          <div *ngFor="let msg of messages" [class.msg-sent]="msg.senderId !== creatorId" [class.msg-received]="msg.senderId === creatorId" class="message-bubble">
            <div class="bubble-content">
               {{ msg.content }}
            </div>
            <span class="msg-time">{{ msg.timestamp | date:'HH:mm' }}</span>
          </div>
          <div *ngIf="messages.length === 0" class="empty-chat">
            <span class="material-symbols-outlined large-icon">chat</span>
            <p>Commencez la discussion avec {{ creatorName }}</p>
          </div>
        </div>

        <footer class="chat-footer">
          <div class="input-area">
            <button class="icon-btn"><span class="material-symbols-outlined">add_circle</span></button>
            <input 
              type="text" 
              [(ngModel)]="newMessage" 
              (keyup.enter)="sendMessage()" 
              placeholder="Écrivez votre message..."
              class="message-input"
            />
            <button class="send-btn" (click)="sendMessage()" [disabled]="!newMessage.trim()">
              <span class="material-symbols-outlined">send</span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      background: #f8fafc;
      font-family: 'Inter', sans-serif;
    }

    .chat-wrapper {
      display: flex;
      height: 100%;
      max-width: 1440px;
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }

    /* Sidebar */
    .chat-sidebar {
      width: 320px;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      background: #fff;
    }

    .sidebar-header {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid #f1f5f9;
    }

    .sidebar-header h2 {
      font-size: 1.25rem;
      font-weight: 800;
      color: #1e293b;
    }

    .back-btn {
      background: #f1f5f9;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s;
    }

    .back-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .conversation-item {
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .conversation-item.active {
      background: #f0f7ff;
      border-right: 3px solid #3b82f6;
    }

    .avatar {
      width: 48px;
      height: 48px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .conv-info .name {
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .conv-info .status {
      font-size: 0.8rem;
      color: #10b981;
      margin: 0;
    }

    /* Main Area */
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #fff;
    }

    .chat-header {
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
    }

    .creator-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar-sm {
      width: 40px;
      height: 40px;
      background: #e2e8f0;
      color: #64748b;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .creator-info h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      color: #1e293b;
    }

    .online-indicator {
      font-size: 0.75rem;
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .online-indicator::before {
      content: '';
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      background: transparent;
      border: none;
      color: #64748b;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-btn:hover {
      background: #f1f5f9;
      color: #3b82f6;
    }

    .messages-container {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #f8fafc;
      background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
      background-size: 20px 20px;
    }

    .message-bubble {
      max-width: 70%;
      display: flex;
      flex-direction: column;
    }

    .msg-received {
      align-self: flex-start;
    }

    .msg-sent {
      align-self: flex-end;
    }

    .bubble-content {
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .msg-received .bubble-content {
      background: #fff;
      color: #1e293b;
      border: 1px solid #e2e8f0;
      border-bottom-left-radius: 4px;
    }

    .msg-sent .bubble-content {
      background: #3b82f6;
      color: white;
      border-bottom-right-radius: 4px;
    }

    .msg-time {
      font-size: 0.7rem;
      color: #94a3b8;
      margin-top: 4px;
      padding: 0 4px;
    }

    .msg-sent .msg-time {
      text-align: right;
    }

    .empty-chat {
      margin: auto;
      text-align: center;
      color: #94a3b8;
    }

    .large-icon {
      font-size: 4rem;
      opacity: 0.3;
      margin-bottom: 1rem;
    }

    /* Footer */
    .chat-footer {
      padding: 16px 24px;
      background: #fff;
      border-top: 1px solid #f1f5f9;
    }

    .input-area {
      background: #f1f5f9;
      border-radius: 24px;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .message-input {
      flex: 1;
      background: transparent;
      border: none;
      padding: 12px;
      font-size: 0.95rem;
      color: #1e293b;
      outline: none;
    }

    .send-btn {
      background: #3b82f6;
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s, background 0.2s;
    }

    .send-btn:hover:not(:disabled) {
      background: #2563eb;
      transform: scale(1.05);
    }

    .send-btn:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .chat-sidebar {
        display: none;
      }
    }
  `]
})
export class Chat implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private route = inject(ActivatedRoute);
  private messagingService = inject(MessagingService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  creatorId: number = 0;
  creatorName: string = '';
  currentUserId: number = 0;
  messages: Message[] = [];
  newMessage: string = '';

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserId = Number(localStorage.getItem('userId')) || 0;
      // Start WebSocket connection
      this.messagingService.initWebSocket();
    }
    
    // Listen for real-time messages
    this.messagingService.getIncomingMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        // Only add message if it belongs to the current open conversation
        if (msg.senderId === this.creatorId || msg.receiverId === this.creatorId) {
          // Avoid duplicates if REST response arrived faster for own message
          const exists = this.messages.some(m => m.id === msg.id);
          if (!exists) {
            this.messages.push(msg);
            this.scrollToBottom();
            this.cdr.detectChanges();
          }
        }
      });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.creatorId = +params['creatorId'];
      this.loadMessages();
    });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(qParams => {
      this.creatorName = qParams['creatorName'] || 'Créateur';
    });
  }

  ngOnDestroy(): void {
    this.messagingService.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMessages(): void {
    this.messagingService.getConversation(this.creatorId).subscribe(msgs => {
      this.messages = msgs;
      this.scrollToBottom();
      this.cdr.detectChanges();
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const msgData = {
      receiverId: this.creatorId,
      content: this.newMessage
    };

    this.messagingService.sendMessage(msgData).subscribe(sentMsg => {
      this.messages.push(sentMsg);
      this.newMessage = '';
      this.scrollToBottom();
      this.cdr.detectChanges();
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
