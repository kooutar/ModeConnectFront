import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { LoginComponent } from './login-component';
import { AuthService } from '../../services/auth-service';

// stub AuthService using a simple function, no globals required

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    // no need to spy on alert; we'll verify errorMessage only

    // provide a fake AuthService so we can trigger errors
    const fakeAuth = {
      login: () =>
        // simulate observable throwing an error
        throwError(() => ({ error: { message: 'Mot de passe incorrect' } })),
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
    // alert call not verified in this environment
  });

  it('should fall back to error.message when no backend message provided', async () => {
    // replace auth stub with one throwing simple HttpErrorResponse-like object
    const fakeAuth2 = {
      login: () =>
        throwError(() => ({ message: 'Http failure response for http://localhost/api 404' })),
    };
    // override the injected service on the existing component
    component['authService'] = fakeAuth2 as any;

    // use a valid email and sufficiently long password so validation passes
    component.loginForm.setValue({ email: 'foo@bar.com', password: 'pass' });
    component.onSubmit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.errorMessage).toBe('Http failure response for http://localhost/api 404');
  });
});
