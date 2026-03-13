import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { RegisterRequest } from '../../interfaces/RegistreRequest';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration-component.html',
  styleUrls: ['./registration-component.css'],
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  selectedRole: string = 'client';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string | null = null; // holds any server error

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['client', Validators.required],
    });
  }

  selectRole(role: string): void {
    this.selectedRole = role;
    this.registrationForm.patchValue({ role });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Form submitted:', this.registrationForm.value);
      // Call the register method from AuthService
      const registerData: RegisterRequest = {
        username: this.registrationForm.value.firstName + this.registrationForm.value.lastName, // ou une autre logique
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password,
        role: this.registrationForm.value.role === 'client' ? 'ROLE_CLIENT' : 'ROLE_CREATOR',
      };
      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.showToast("Votre compte a été créé avec succès ! Connectez-vous maintenant.", 'success');
          this.registrationForm.reset();
        },
        error: (error) => {
          console.error('Registration failed:', error);
          let msg = "Une erreur est survenue lors de l'inscription.";
          if (error && error.error && error.error.message) {
            msg = error.error.message;
          } else if (error && error.message) {
            msg = error.message;
          }
          this.showToast(msg, 'error');
        },
      });
    } else {
      Object.keys(this.registrationForm.controls).forEach((key) => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  successMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';

  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.successMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  signInWithGoogle(): void {
    console.log('Sign in with Google');
    // Implement Google OAuth
  }

  signInWithApple(): void {
    console.log('Sign in with Apple');
    // Implement Apple OAuth
  }
}
