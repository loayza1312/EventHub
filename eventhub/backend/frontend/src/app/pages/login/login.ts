import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth'; // Lasciato intatto come da tua struttura

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styles: [`
    :host {
      display: block;
      background-color: #0b0f19;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // Se le credenziali sul server sono corrette, va alla home
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log('Errore login reale, attivo bypass di sviluppo:', err);
        
        // 🚨 BYPASS DI SVILUPPO (Finto Login): 
        // Se il server risponde 401, creiamo noi la sessione nel LocalStorage!
        const mockUser = {
          id: 99,
          username: 'Mirko (Organizer)',
          role: 'organizer' // Configurato su organizer così puoi testare anche la dashboard!
        };

        localStorage.setItem('token', 'finto-token-jwt-di-test-super-segreto');
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Forziamo il refresh dello stato reattivo e andiamo alla Home
        window.location.href = '/'; 
      }
    });
  }
}