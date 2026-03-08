import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { ModelListComponent } from './model-list.component';
import { ModelService } from '../../services/model-service';
import { Model } from '../../interfaces/Model';

describe('ModelListComponent', () => {
  let component: ModelListComponent;
  let fixture: ComponentFixture<ModelListComponent>;

  const fakeModels: Model[] = [
    {
      id: 1,
      name: 'Test Model',
      description: 'desc',
      purchasePrice: 100,
      rentalPrice: 20,
      creatorId: 5,
      creatorName: 'creator',
      available: true,
      mediaList: [],
    },
  ];

  beforeEach(async () => {
    const fakeService = {
      getAllModels: () => of(fakeModels),
    };

    await TestBed.configureTestingModule({
      imports: [ModelListComponent, RouterTestingModule],
      providers: [{ provide: ModelService, useValue: fakeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load models on init', () => {
    expect(component.models.length).toBe(1);
    expect(component.models[0].name).toBe('Test Model');
  });

  it('should set error message when service fails', async () => {
    const fakeService = {
      getAllModels: () => throwError(() => new Error('fail')),
    };
    // override the injected service instance directly rather than reconfiguring
    component['modelService'] = fakeService as any;
    component.loadModels();
    expect(component.error).toBe('Impossible de récupérer les modèles.');
  });
});
