import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { AuthService } from '../../services/auth-service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string | null = null; // holds server/client error text

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
    this.authService = authService;
    this.authService = authService;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = null; // clear any previous error
    console.log('Submitting form...', this.loginForm.valid);
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          // navigate or reset state as needed
        },
        error: (error) => {
          console.error('Login failed:', error);
          // attempt to extract error message from backend response
          if (error && error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error && error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Une erreur est survenue lors de la connexion.';
          }
        },
      });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
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

