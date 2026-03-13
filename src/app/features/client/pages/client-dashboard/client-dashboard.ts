import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Model } from '../../interfaces/Model';
import { ClientOrder } from '../../interfaces/ClientOrder';
import { ModelService } from '../../services/model-service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-dashboard.html',
  styleUrls: ['./client-dashboard.css'],
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  rentedModels: Model[] = [];
  loading = false;
  error: string | null = null;
  baseImageUrl = 'http://localhost:8080';

  orders: ClientOrder[] = [];
  ordersLoading = false;
  ordersError: string | null = null;

  username: string = 'Sophie Martin';

  totalSpent: number = 0;
  pendingOrdersCount: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private modelService: ModelService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        this.username = storedUsername;
      }
      // Charge les données au premier chargement
      this.loadData();

      // Recharge les données à chaque fois que cette route est activée
      this.activatedRoute.url.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.loadData();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.loadClientOrders();
    this.loadRentedModels();
  }

  loadRentedModels(): void {
    this.loading = true;
    this.error = null;
    this.modelService.getRentedModels().subscribe({
      next: (models) => {
        this.rentedModels = models || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading rented models:', err);
        this.error = 'Impossible de charger vos modèles loués.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadClientOrders(): void {
    this.ordersLoading = true;
    this.ordersError = null;

    this.modelService.getClientOrders().subscribe({
      next: (orders) => {
        this.orders = orders || [];
        this.calculateStats();
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

  calculateStats() {
    this.pendingOrdersCount = this.orders.filter(o => o.status === 'PENDING').length;
    // Note: Le prix n'est pas directement dans l'ordre, on pourrait l'estimer ou le backend devrait le fournir
    // Pour l'instant, on laisse le total Spent à une valeur calculée si on avait le prix.
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/login';
  }
}
