import { Component, Inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Model } from '../../client/interfaces/Model';
import { ModelService } from '../../client/services/model-service';
import { CreatorSidebarComponent } from '../components/creator-sidebar/creator-sidebar.component';

@Component({
  selector: 'app-creator-dashboard',
  standalone: true,
  imports: [CommonModule, CreatorSidebarComponent, FormsModule, RouterLink],
  templateUrl: './creator-dashboard.html',
  styleUrl: './creator-dashboard.css',
})
export class CreatorDashboard implements OnInit {
  models: Model[] = [];
  loading = false;
  error: string | null = null;
  baseImageUrl = 'http://localhost:8080';

  // Modal State
  showCreateModal = false;
  showUpdateModal = false;
  createLoading = false;
  updateLoading = false;
  successMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';

  newModel = {
    name: '',
    description: '',
    purchasePrice: 0,
    rentalPrice: 0
  };

  selectedModel: Model | null = null;

  constructor(
    private modelService: ModelService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCreatorModels();
    }
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  openModal() {
    this.showCreateModal = true;
    this.newModel = {
      name: '',
      description: '',
      purchasePrice: 0,
      rentalPrice: 0
    };
  }

  closeModal() {
    this.showCreateModal = false;
    this.showUpdateModal = false;
    this.selectedModel = null;
  }

  submitCreateModel() {
    if (!this.newModel.name || this.newModel.purchasePrice <= 0) {
      this.showToast('Veuillez remplir les champs obligatoires.', 'error');
      return;
    }

    this.createLoading = true;

    this.modelService.createModel(this.newModel).subscribe({
      next: (model) => {
        this.models.unshift(model); // Ajouter au début de la liste
        this.showCreateModal = false;
        this.createLoading = false;
        this.showSuccess('Modèle créé avec succès !');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur creation modèle:', err);
        this.createLoading = false;
        this.showToast('Erreur lors de la création du modèle.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  openEditModal(model: Model) {
    this.selectedModel = model;
    this.newModel = {
      name: model.name,
      description: model.description,
      purchasePrice: model.purchasePrice,
      rentalPrice: model.rentalPrice
    };
    this.showUpdateModal = true;
  }

  submitUpdateModel() {
    if (!this.selectedModel) return;

    this.updateLoading = true;

    this.modelService.updateModel(this.selectedModel.id, this.newModel).subscribe({
      next: (updated) => {
        const index = this.models.findIndex(m => m.id === updated.id);
        if (index !== -1) {
          this.models[index] = updated;
        }
        this.showUpdateModal = false;
        this.updateLoading = false;
        this.showSuccess('Modèle mis à jour !');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur update:', err);
        this.updateLoading = false;
        this.showToast('Échec de la mise à jour.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  deleteModel(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      this.modelService.deleteModel(id).subscribe({
        next: () => {
          this.models = this.models.filter(m => m.id !== id);
          this.showSuccess('Modèle supprimé.');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur delete:', err);
          this.showToast('Erreur lors de la suppression.', 'error');
        }
      });
    }
  }

  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.successMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // legacy name for compatibility if needed elsewhere
  showSuccess(msg: string) {
    this.showToast(msg, 'success');
  }

  loadCreatorModels(): void {
    this.loading = true;
    this.error = null;

    this.modelService.getCreatorModels().subscribe({
      next: (models) => {
        this.models = models || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des modèles créateur :', err);
        this.error = 'Impossible de charger vos modèles.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
