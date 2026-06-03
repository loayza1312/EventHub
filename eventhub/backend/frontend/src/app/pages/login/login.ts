import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div style="max-width: 400px; margin: 60px auto; padding: 30px; font-family: sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #3f51b5; text-align: center; margin-bottom: 20px;">Accedi a EventHub</h2>
      <div *ngIf="errorMessage" style="padding: 10px; margin-bottom: 15px; background-color: #ffebee; color: #c62828; border-radius: 4px;">{{ errorMessage }}</div>
      <form (ngSubmit)="onLogin()">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Email</label>
          <input type="email" [(ngModel)]="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Password</label>
          <input type="password" [(ngModel)]="password" name="password" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        <button type="submit" style="width: 100%; padding: 12px; background-color: #3f51b5; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">Entra</button>
      </form>
      <p style="text-align: center; margin-top: 15px; color: #666;">Non hai un account? <a routerLink="/register" style="color: #3f51b5; text-decoration: none; font-weight: bold;">Registrati</a></p>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  constructor(private authService: AuthService, private router: Router) {}
  onLogin() {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => { this.router.navigate(['/']); },
      error: () => { this.errorMessage = 'Errore di connessione. Flask è spento!'; }
    });
  }
}
