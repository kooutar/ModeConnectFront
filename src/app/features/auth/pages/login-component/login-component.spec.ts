import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { LoginComponent } from './login-component';
import { AuthService } from '../../services/auth-service';

declare const jasmine: any; // global provided by test runner

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    // provide a fake AuthService so we can trigger errors
    const fakeAuth = {
      login: jasmine.createSpy('login').and.returnValue(
        // simulate observable throwing an error
        throwError(() => ({ error: { message: 'Mot de passe incorrect' } })),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: fakeAuth }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display backend error message when login fails', async () => {
    // prepare form with valid values
    component.loginForm.setValue({ email: 'test@test.com', password: 'wrong' });
    component.onSubmit();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(component.errorMessage).toBe('Mot de passe incorrect');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Mot de passe incorrect');
  });
});
