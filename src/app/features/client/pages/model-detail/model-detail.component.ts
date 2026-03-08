import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { Model } from '../../interfaces/Model';
import { ModelService } from '../../services/model-service';

@Component({
  selector: 'app-model-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './model-detail.component.html',
  styleUrls: ['./model-detail.component.css'],
})
export class ModelDetailComponent implements OnInit {
  model: Model | null = null;
  loading = false;
  error: string | null = null;
  baseImageUrl = 'http://localhost:8080';
  selectedImageIndex = 0;
  selectedSize = '36';
  selectedColor = 'white';
  isInWishlist = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modelService: ModelService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

ngOnInit(): void {
  const inBrowser = isPlatformBrowser(this.platformId);

  if (!inBrowser) {
    // SSR : ne pas appeler l'API (pas de token dispo), juste le squelette
    this.loading = true;
    return;
  }

  // Browser uniquement
  const idParam = this.route.snapshot.paramMap.get('id');
  const id = idParam ? Number(idParam) : null;

  const stateModel = history.state?.model as Model | undefined;

  if (stateModel) {
    this.model = stateModel;
    this.loading = false;
  } else if (id) {
    this.loadModel(id);
  } else {
    this.error = 'Modèle introuvable.';
  }
}
  private loadModel(id: number): void {
    console.log('[model-detail] loading model from API', { id });
    this.loading = true;
    this.error = null;
    this.modelService.getModelById(id).subscribe({
      next: (data) => {
        console.log('[model-detail] model loaded', data);
        this.model = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('model-detail error', err);
        if (err && err.status === 403) {
          this.error = 'Accès refusé, veuillez vous reconnecter.';
        } else if (err && err.status === 404) {
          this.error = 'Ce modèle n’existe pas ou plus.';
        } else {
          this.error = 'Impossible de charger les détails du modèle.';
        }
        this.loading = false;
      },
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  toggleWishlist(): void {
    this.isInWishlist = !this.isInWishlist;
  }

  addToCart(): void {
    // TODO: brancher plus tard sur un vrai panier
    console.log('Added to cart', this.model?.id);
  }
}
