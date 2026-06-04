import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
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
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'user'; // Valore di default preimpostato

  private backendUrl = 'https://glowing-tribble-pjpqvrj4w6rwc9p7g-5000.app.github.dev';

  onRegister(event: Event) {
    event.preventDefault(); // Blocca il refresh nativo della pagina

    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      alert('❌ Compila tutti i campi obbligatori.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('❌ Le password inserite non corrispondono.');
      return;
    }

    const body = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    };

    fetch(`${this.backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Errore indefinito lato server');
      }
      return data;
    })
    .then(() => {
      alert('🎉 Registrazione completata con successo! Ora puoi effettuare l\'accesso.');
      window.location.href = '/login'; // Ridirezione sicura e immediata
    })
    .catch((err) => {
      console.error('Errore durante la registrazione:', err);
      alert(`❌ Impossibile completare la registrazione: ${err.message || 'Email o Username già esistenti.'}`);
    });
  }
}