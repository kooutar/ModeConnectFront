import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Model } from '../../client/interfaces/Model';
import { ModelService } from '../../client/services/model-service';
import { CreatorSidebarComponent } from '../components/creator-sidebar/creator-sidebar.component';

@Component({
  selector: 'app-creator-model-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CreatorSidebarComponent],
  templateUrl: './creator-model-detail.component.html',
  styleUrl: './creator-model-detail.component.css'
})
export class CreatorModelDetailComponent implements OnInit {
  model: Model | null = null;
  loading = false;
  error: string | null = null;
  baseImageUrl = 'http://localhost:8080';
  selectedImageIndex = 0;

  // Upload Modal State
  showUploadModal = false;
  uploadLoading = false;
  uploadError: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private modelService: ModelService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.loadModel(id);
      }
    }
  }

  loadModel(id: number): void {
    this.loading = true;
    this.modelService.getModelById(id).subscribe({
      next: (data) => {
        this.model = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading model detail:', err);
        this.error = 'Impossible de charger les détails du modèle.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  openUploadModal(): void {
    this.showUploadModal = true;
    this.uploadError = null;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Veuillez sélectionner une image valide.';
        return;
      }
      this.selectedFile = file;
      this.uploadError = null;

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  submitUpload(): void {
    if (!this.selectedFile || !this.model) return;

    this.uploadLoading = true;
    this.uploadError = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.modelService.uploadModelMedia(this.model.id, formData).subscribe({
      next: (response) => {
        // Recharger le modèle pour voir la nouvelle image
        this.loadModel(this.model!.id);
        this.closeUploadModal();
        this.uploadLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur upload:', err);
        this.uploadError = "Échec de l'envoi de l'image.";
        this.uploadLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
