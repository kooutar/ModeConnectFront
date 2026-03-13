import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CreatorOrderService } from '../services/creator-order.service';
import { OrderResponseDto } from '../interfaces/OrderResponseDto';
import { RouterLink } from '@angular/router';

import { CreatorSidebarComponent } from '../components/creator-sidebar/creator-sidebar.component';

@Component({
  selector: 'app-creator-orders',
  standalone: true,
  imports: [CommonModule, CreatorSidebarComponent],
  templateUrl: './creator-orders.component.html',
  styleUrls: ['./creator-orders.component.css']
})
export class CreatorOrdersComponent implements OnInit {
  orders: OrderResponseDto[] = [];
  loading = false;
  error: string | null = null;
  actionLoading: number | null = null;
  successMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';

  constructor(
    private orderService: CreatorOrderService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commandes :', err);
        this.error = 'Impossible de charger vos commandes.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  acceptOrder(orderId: number): void {
    this.actionLoading = orderId;
    this.orderService.acceptOrder(orderId).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.showSuccess("La commande a été acceptée avec succès !");
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors de l'acceptation :", err);
        this.showToast("Erreur: Impossible d'accepter la commande.", 'error');
        this.actionLoading = null;
        this.cdr.detectChanges();
      }
    });
  }

  rejectOrder(orderId: number): void {
    this.actionLoading = orderId;
    this.orderService.rejectOrder(orderId).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.showSuccess("La commande a été refusée.");
        this.actionLoading = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du refus :", err);
        this.showToast("Erreur: Impossible de refuser la commande.", 'error');
        this.actionLoading = null;
        this.cdr.detectChanges();
      }
    });
  }

  showToast(msg: string, type: 'success' | 'error' = 'success'): void {
    this.successMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // compatibility
  showSuccess(msg: string) {
    this.showToast(msg, 'success');
  }
}
