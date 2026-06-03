import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      alert('❌ Compila tutti i campi.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('❌ Le password non corrispondono.');
      return;
    }

    const body = { name: this.name, email: this.email, password: this.password };

    this.http.post('https://glowing-tribble-pjpqvrj4w6rwc9p7g-5000.app.github.dev/api/register', body).subscribe({
      next: () => {
        alert('🎉 Registrazione completata con successo! Ora puoi accedere.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Errore registrazione:', err);
        alert('❌ Impossibile registrarsi. L\'email potrebbe essere già in uso.');
      }
    });
  }
}