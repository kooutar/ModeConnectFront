import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelDetailComponent } from './model-detail.component';

describe('ModelDetailComponent', () => {
  let component: ModelDetailComponent;
  let fixture: ComponentFixture<ModelDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select image', () => {
    component.selectImage(1);
    expect(component.selectedImageIndex).toBe(1);
  });

  it('should select multiple images', () => {
    component.selectImage(2);
    expect(component.selectedImageIndex).toBe(2);
    component.selectImage(0);
    expect(component.selectedImageIndex).toBe(0);
  });

  it('should toggle wishlist', () => {
    expect(component.isInWishlist).toBeFalsy();
    component.toggleWishlist();
    expect(component.isInWishlist).toBeTruthy();
    component.toggleWishlist();
    expect(component.isInWishlist).toBeFalsy();
  });

  it('should call addToCart method', () => {
    expect(() => component.addToCart()).not.toThrow();
  });

  it('should update selected size', () => {
    expect(component.selectedSize).toBe('36');
    component.selectedSize = '38';
    expect(component.selectedSize).toBe('38');
  });

  it('should update selected color', () => {
    expect(component.selectedColor).toBe('white');
    component.selectedColor = 'purple';
    expect(component.selectedColor).toBe('purple');
  });
});
