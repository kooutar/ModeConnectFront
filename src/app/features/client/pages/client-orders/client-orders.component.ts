import { Component, Inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientOrder } from '../../interfaces/ClientOrder';
import { ModelService } from '../../services/model-service';

@Component({
  selector: 'app-client-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-orders.component.html',
  styleUrls: ['./client-orders.component.css'],
})
export class ClientOrdersComponent implements OnInit {
  orders: ClientOrder[] = [];
  ordersLoading = false;
  ordersError: string | null = null;
  username: string = 'Sophie Martin';

  constructor(
    private modelService: ModelService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        this.username = storedUsername;
      }
      this.loadClientOrders();
    }
  }

  loadClientOrders(): void {
    this.ordersLoading = true;
    this.ordersError = null;

    this.modelService.getClientOrders().subscribe({
      next: (orders) => {
        this.orders = orders || [];
        this.ordersLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commandes client :', err);
        this.ordersError = 'Impossible de charger vos commandes.';
        this.ordersLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/login';
  }
}
