import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api';
import { ChangeDetectorRef } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['test@mail.testt', [Validators.required, Validators.email]],
      password: ['test_password', [Validators.required]]
    });
  }

  onSubmit() {

    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.api.request('POST', 'auth/login', this.loginForm.value)
      .subscribe({
        next: (res: any) => {
          console.log('Login successful:', res);
          // Stocker le token dans localStorage
          localStorage.setItem('token', res.token);

          // Stocker éventuellement l'utilisateur
          localStorage.setItem('user', JSON.stringify(res.user));

          // Redirection selon rôle
          const role = res.user.role;
          if (role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (role === 'boutique') {
            this.router.navigate(['/boutique']);
          } else {
            // Pour tout autre rôle, revenir à l'accueil public
            this.router.navigate(['/']);
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Email ou mot de passe incorrect.';
          this.loading = false;
          // console.error('Login failed:', err);
          this.cdr.detectChanges();
        }
      });
  }
}
