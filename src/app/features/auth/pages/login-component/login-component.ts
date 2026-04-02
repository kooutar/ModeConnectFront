import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  errorMessage: string | null = null; // holds server/client error text

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    
  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
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
          console.log('Received token:', response.token);
          // store tokens if provided
          if (response.token) {
            localStorage.setItem('token', response.token); // match interceptor key
            localStorage.setItem('authToken', response.token); // keep legacy key
          }
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          if (response.username) {
            localStorage.setItem('username', response.username);
          }
          if (response.userId) {
            localStorage.setItem('userId', response.userId.toString());
          }
           const role = response.role;

            if (role === 'ROLE_CLIENT') {
              this.router.navigate(['/dashboard']);
            } 
            else if (role === 'ROLE_CREATOR') {
              this.router.navigate(['/creator']);
            } 
         
        },
        error: (error) => {
          console.error('Login failed:', error);
          // attempt to extract a user-friendly message
          if (error && error.error) {
            // backend might send a message property or plain text
            if (typeof error.error === 'string') {
              this.errorMessage = error.error;
            } else if (error.error.message) {
              this.errorMessage = error.error.message;
            }
          }
          // fallback to the generic HTTP message
          if (!this.errorMessage && error && error.message) {
            this.errorMessage = error.message;
          }
          if (!this.errorMessage) {
            this.errorMessage = 'Une erreur est survenue lors de la connexion.';
          }
          // use showToast logic instead of alert
          this.showToast(this.errorMessage, 'error');
        },
      });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
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
