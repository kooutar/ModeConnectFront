import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { ModelService } from '../../services/model-service';
import { Model } from '../../interfaces/Model';

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'name_asc';
type AvailabilityFilter = 'all' | 'available' | 'on_appointment';

interface ModelWithRating extends Model {
  averageRating: number;
}

@Component({
  selector: 'app-model-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, FormsModule],
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css'],
})
export class ModelListComponent implements OnInit {
  // Données brutes
  allModels: ModelWithRating[] = [];
  
  // Données filtrées à afficher (évite les calculs répétitifs au rendu)
  filteredModels: ModelWithRating[] = [];

  // États UI
  loading = false;
  error: string | null = null;
  baseImageUrl = 'http://localhost:8080';

  // Filtres (avec setters pour mettre à jour automatiquement la liste filtrée)
  private _searchQuery = '';
  get searchQuery() { return this._searchQuery; }
  set searchQuery(val: string) {
    this._searchQuery = val;
    this.applyFilters();
  }

  private _selectedSort: SortOption = 'default';
  get selectedSort() { return this._selectedSort; }
  set selectedSort(val: SortOption) {
    this._selectedSort = val;
    this.applyFilters();
  }

  private _availabilityFilter: AvailabilityFilter = 'all';
  get availabilityFilter() { return this._availabilityFilter; }
  set availabilityFilter(val: AvailabilityFilter) {
    this._availabilityFilter = val;
    this.applyFilters();
  }

  private _minPrice: number | null = null;
  get minPrice() { return this._minPrice; }
  set minPrice(val: number | null) {
    this._minPrice = val;
    this.applyFilters();
  }

  private _maxPrice: number | null = null;
  get maxPrice() { return this._maxPrice; }
  set maxPrice(val: number | null) {
    this._maxPrice = val;
    this.applyFilters();
  }

  showFilters = false;

  constructor(
    private modelService: ModelService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadModels();
    }
  }

  loadModels() {
    this.loading = true;
    this.error = null;
    this.modelService.getAllModels().subscribe({
      next: (data) => {
        // Utiliser les moyennes pré-calculées par le backend
        this.allModels = data.map(m => ({
          ...m,
          averageRating: m.averageRating || 0
        }));
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('model-list error', err);
        this.error = 'Impossible de récupérer les modèles.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters() {
    let result = [...this.allModels];

    // 1. Recherche texte (nom ou créateur)
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.creatorName.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }

    // 2. Filtre disponibilité
    if (this.availabilityFilter === 'available') {
      result = result.filter((m) => m.available);
    } else if (this.availabilityFilter === 'on_appointment') {
      result = result.filter((m) => !m.available);
    }

    // 3. Filtre prix min
    if (this.minPrice !== null && this.minPrice > 0) {
      result = result.filter((m) => m.rentalPrice >= this.minPrice!);
    }

    // 4. Filtre prix max
    if (this.maxPrice !== null && this.maxPrice > 0) {
      result = result.filter((m) => m.rentalPrice <= this.maxPrice!);
    }

    // 5. Tri
    switch (this.selectedSort) {
      case 'price_asc':
        result.sort((a, b) => a.rentalPrice - b.rentalPrice);
        break;
      case 'price_desc':
        result.sort((a, b) => b.rentalPrice - a.rentalPrice);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    this.filteredModels = result;
  }

  get hasActiveFilters(): boolean {
    return (
      this.searchQuery.trim() !== '' ||
      this.availabilityFilter !== 'all' ||
      this.selectedSort !== 'default' ||
      (this.minPrice !== null && this.minPrice > 0) ||
      (this.maxPrice !== null && this.maxPrice > 0)
    );
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchQuery.trim()) count++;
    if (this.availabilityFilter !== 'all') count++;
    if (this.selectedSort !== 'default') count++;
    if (this.minPrice !== null && this.minPrice > 0) count++;
    if (this.maxPrice !== null && this.maxPrice > 0) count++;
    return count;
  }

  resetFilters() {
    this._searchQuery = '';
    this._selectedSort = 'default';
    this._availabilityFilter = 'all';
    this._minPrice = null;
    this._maxPrice = null;
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  trackByModelId(index: number, item: ModelWithRating): number {
    return item.id;
  }
}
