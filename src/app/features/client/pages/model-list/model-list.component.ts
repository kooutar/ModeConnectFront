import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { ModelService } from '../../services/model-service';
import { Model } from '../../interfaces/Model';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-model-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css'],
})
export class ModelListComponent implements OnInit {
  models: Model[] = [];
  loading = false;
  error: string | null = null;
  baseImageUrl = 'http://localhost:8080';

  constructor(
    private modelService: ModelService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    // Ne charger les modèles que côté navigateur (évite les appels API sans token pendant le SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.loadModels();
    }
  }

  loadModels() {
    this.loading = true;
    this.error = null;
    this.modelService.getAllModels().subscribe({
      next: (data) => {
        console.log('models loaded', data);
        this.models = data;
        this.loading = false;
        this.cdr.detectChanges(); // Forcer la mise à jour de la vue
      },
      error: (err) => {
        console.error('model-list error', err);
        if (err && err.status === 403) {
          this.error = 'Accès refusé, veuillez vous reconnecter.';
        } else {
          this.error = 'Impossible de récupérer les modèles.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
