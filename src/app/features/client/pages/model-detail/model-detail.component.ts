import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { Model } from '../../interfaces/Model';
import { ModelService } from '../../services/model-service';
import { ReviewService, ReviewRequestDto, ReviewResponseDto } from '../../services/review-service';

@Component({
  selector: 'app-model-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
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

  // Modal de location
  showRentalModal = false;
  rentalStartDate: string = '';
  rentalEndDate: string = '';
  rentalDays = 0;
  rentalLoading = false;
  rentalError: string | null = null;
  hasRented = false;
  rentalSuccess = false;

  // États pour l'achat
  buyLoading = false;
  buySuccess = false;
  buyError: string | null = null;
  hasBought = false;

  // Date minimum pour limiter les réservations dans le passé
  minDate: string = '';

  // Review modal properties (for already purchased/rented models)
  isReviewModalOpen = false;
  reviewForm: FormGroup;
  reviewSubmitting = false;
  reviewError: string | null = null;
  reviewSuccess: string | null = null;
  selectedOrderIdForReview: number | null = null;
  hasOrderedThisModel = false;
  modelReviews: ReviewResponseDto[] = [];
  reviewsLoading = false;

  get averageRating(): number {
    const reviews = this.modelReviews.length > 0 ? this.modelReviews : (this.model?.reviews || []);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rate || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modelService: ModelService,
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.reviewForm = this.fb.group({
      rate: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

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

    // Date minimum pour les modales de date (aujourd'hui)
    this.minDate = new Date().toISOString().split('T')[0];

    const stateModel = history.state?.model as Model | undefined;

    if (stateModel) {
      this.model = stateModel;
      this.modelReviews = stateModel.reviews || [];
      this.loading = false;
      this.checkUserOrders(stateModel.id);
    } else if (id) {
      this.loadModel(id);
    } else {
      this.error = 'Modèle introuvable.';
    }
  }
  private loadModel(id: number): void {
    this.loading = true;
    this.error = null;
    this.modelService.getModelById(id).subscribe({
      next: (data) => {
        this.model = data;
        this.loading = false;
        this.cdr.detectChanges();

        if (data.reviews && data.reviews.length > 0) {
          this.modelReviews = data.reviews;
        }

        this.checkUserOrders(data.id);
        this.cdr.detectChanges();
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
    console.log('Added to cart', this.model?.id);
  }

  rentModel(): void {
    if (this.model) {
      this.showRentalModal = true;
      const today = new Date().toISOString().split('T')[0];
      this.rentalStartDate = today;
      this.rentalEndDate = '';
      this.rentalDays = 0;
      this.rentalError = null;
    }
  }

  onStartDateChange(): void {
    this.calculateRentalDays();
  }

  onEndDateChange(): void {
    this.calculateRentalDays();
  }

  calculateRentalDays(): void {
    if (this.rentalStartDate && this.rentalEndDate) {
      const start = new Date(this.rentalStartDate);
      const end = new Date(this.rentalEndDate);
      const timeDiff = end.getTime() - start.getTime();
      this.rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (this.rentalDays < 0) {
        this.rentalDays = 0;
      }
    }
  }

  submitRental(): void {
    if (!this.model || this.rentalDays <= 0) {
      this.rentalError = 'Veuillez sélectionner des dates valides';
      return;
    }

    this.rentalLoading = true;
    this.rentalError = null;

    const rentalRequest = {
      orderType: 'RENTAL',
      reservation_days: this.rentalDays,
      reservationDate: this.rentalStartDate,
    };

    this.modelService.createOrder(this.model.id, rentalRequest).subscribe({
      next: (response) => {
        this.hasRented = true;
        this.rentalSuccess = true;
        this.rentalLoading = false;
        this.showRentalModal = false;
        
        if (this.model) {
          this.checkUserOrders(this.model.id);
        }
        
        this.cdr.detectChanges();

        setTimeout(() => {
          this.rentalSuccess = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors de la location:', err);
        // Extraire le message d'erreur du backend
        let errorMessage = 'Erreur lors de la création de la réservation';

        if (err?.error) {
          // Le backend envoie le message dans err.error
          if (typeof err.error === 'string') {
            // Nettoyer le préfixe "err " si présent
            errorMessage = err.error.replace(/^err\s*/i, '');
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
        } else if (err?.message) {
          errorMessage = err.message;
        }

        // Vérification spécifique du status 404 qui est envoyé par le backend
        // lorsqu'un modèle a déjà été commandé/loué par cet utilisateur.
        if (err?.status === 404 || err?.status === 400) {
           this.hasRented = true;
           errorMessage = 'Vous avez déjà loué ce modèle ou il est indisponible.';
        }

        this.rentalError = errorMessage;
        this.rentalLoading = false;
        this.showRentalModal = false; // fermer la modal pour afficher le message sur la page
        this.cdr.detectChanges();

        // Si le backend indique que la commande existe déjà, on marque comme réservé
        if (errorMessage.toLowerCase().includes('déjà passé')) {
          this.hasRented = true;
          this.cdr.detectChanges();
        }
      },
    });
  }

  closeRentalModal(): void {
    this.showRentalModal = false;
    this.rentalError = null;
  }

  buyModel(): void {
    if (!this.model) {
      return;
    }

    this.buyLoading = true;
    this.buyError = null;

    const purchaseRequest = {
      orderType: 'PURCHASE',
      size: this.selectedSize,
      color: this.selectedColor
    };

    this.modelService.createOrder(this.model.id, purchaseRequest).subscribe({
      next: (response) => {
        this.hasBought = true;
        this.buySuccess = true;
        this.buyLoading = false;

        // Rafraîchir l'état des commandes
        if (this.model) {
          this.checkUserOrders(this.model.id);
        }

        this.cdr.detectChanges();

        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          this.buySuccess = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors de l\'achat:', err);
        let errorMessage = 'Erreur lors de la création de la commande';

        if (err?.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error.replace(/^err\s*/i, '');
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
        } else if (err?.message) {
          errorMessage = err.message;
        }

        this.buyError = errorMessage;
        this.buyLoading = false;
        this.cdr.detectChanges();

        // Effacer l'erreur après 5 secondes
        setTimeout(() => {
          this.buyError = null;
          this.cdr.detectChanges();
        }, 5000);
      },
    });
  }

  // ==== Review Section Methods ====

  openReviewModal(): void {
    this.isReviewModalOpen = true;
    this.reviewSuccess = null;
    this.reviewError = null;
    this.reviewForm.reset({ rate: 5, comment: '' });
  }

  closeReviewModal(): void {
    this.isReviewModalOpen = false;
    this.reviewForm.reset();
  }

  // NOTE: This assumes we have a way to know the orderId to link the review to. 
  // For a detail view, the user might have multiple orders for this model, or we just submit with a pseudo orderId or need an endpoint that infers orderId from clientId + modelId. We assume we find the first accepted order if needed, but since we didn't fetch orders here, we'll try to let standard validation catch it or assume it is handled by the backend.
  submitReview(): void {
    if (this.reviewForm.invalid || !this.model) return;

    this.reviewSubmitting = true;
    this.reviewError = null;
    this.reviewSuccess = null;

    const clientId = localStorage.getItem('userId');

    // Currently the dto expects an orderId so we use a dummy one if we don't know it, 
    // or you can add a method to load user orders first.
    // Assuming backend might just need modelId and clientId or orderId.
    const reviewDto: ReviewRequestDto = {
      clientId: clientId ? parseInt(clientId) : 0,
      orderId: this.selectedOrderIdForReview || this.model.id, 
      rate: this.reviewForm.value.rate,
      comment: this.reviewForm.value.comment,
    };

    this.reviewService.createReview(reviewDto).subscribe({
      next: () => {
        this.reviewSubmitting = false;
        this.reviewSuccess = 'Votre avis a été publié avec succès.';
        this.cdr.detectChanges();
        if (this.model) {
           this.loadModel(this.model.id);
        }
        setTimeout(() => this.closeReviewModal(), 2000);
      },
      error: (err) => {
        this.reviewSubmitting = false;
        this.reviewError = 'Impossible de publier l\'avis. Veuillez réessayer.';
        this.cdr.detectChanges();
      }
     });
  }

  private checkUserOrders(modelId: number): void {
    const inBrowser = isPlatformBrowser(this.platformId);
    if (!inBrowser) return;

    this.hasOrderedThisModel = false;
    this.hasRented = false;
    this.hasBought = false;
    this.selectedOrderIdForReview = null;

    this.modelService.getClientOrders().subscribe({
      next: (orders) => {
        // Vérifier si l'utilisateur a déjà loué ce modèle (ACCEPTED ou PENDING)
        const rentalOrder = orders.find(
          (o) => o.modelId === modelId && o.orderType === 'RENTAL' && (o.status === 'ACCEPTED' || o.status === 'PENDING')
        );
        
        // Vérifier si l'utilisateur a déjà acheté ce modèle
        const purchaseOrder = orders.find(
          (o) => o.modelId === modelId && o.orderType === 'PURCHASE' && o.status === 'ACCEPTED'
        );

        if (rentalOrder) {
          this.hasRented = true;
          this.hasOrderedThisModel = rentalOrder.status === 'ACCEPTED';
          this.selectedOrderIdForReview = rentalOrder.id;
        }

        if (purchaseOrder) {
          this.hasBought = true;
          this.hasOrderedThisModel = true;
          this.selectedOrderIdForReview = purchaseOrder.id;
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors de la vérification des commandes client', err);
      },
    });
  }
}
