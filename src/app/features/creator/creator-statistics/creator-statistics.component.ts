import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatorSidebarComponent } from '../components/creator-sidebar/creator-sidebar.component';
import { CreatorOrderService } from '../services/creator-order.service';
import { OrderResponseDto } from '../interfaces/OrderResponseDto';

@Component({
  selector: 'app-creator-statistics',
  standalone: true,
  imports: [CommonModule, CreatorSidebarComponent],
  templateUrl: './creator-statistics.component.html',
  styleUrls: ['./creator-statistics.component.css']
})
export class CreatorStatisticsComponent implements OnInit {
  private orderService = inject(CreatorOrderService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  orders: OrderResponseDto[] = [];

  stats = {
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    rental: 0,
    purchase: 0,
    ratioAccepted: 0,
    ratioRejected: 0,
    ratioPending: 0
  };

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders || [];
        this.calculateStats();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur stats:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    if (this.orders.length === 0) return;

    this.stats.total = this.orders.length;
    this.stats.accepted = this.orders.filter(o => o.status === 'ACCEPTED').length;
    this.stats.rejected = this.orders.filter(o => o.status === 'REJECTED').length;
    this.stats.pending = this.orders.filter(o => o.status === 'PENDING').length;

    this.stats.rental = this.orders.filter(o => o.orderType === 'RENTAL').length;
    this.stats.purchase = this.orders.filter(o => o.orderType === 'PURCHASE').length;

    this.stats.ratioAccepted = (this.stats.accepted / this.stats.total) * 100;
    this.stats.ratioRejected = (this.stats.rejected / this.stats.total) * 100;
    this.stats.ratioPending = (this.stats.pending / this.stats.total) * 100;
  }

  // Pour le cercle de progression SVG
  getStrokeDashArray(percent: number): string {
    const circumference = 2 * Math.PI * 40; // R=40
    return `${(percent / 100) * circumference} ${circumference}`;
  }
}
