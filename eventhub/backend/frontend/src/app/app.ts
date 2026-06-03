import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html', // Corretto qui!
  styleUrls: ['./app.css']    // Corretto anche per i CSS se si chiama app.css
})
export class AppComponent {
  title = 'EventHub';

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'Utente';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    alert('Log-out effettuato. A presto!');
    this.router.navigate(['/']);
  }
  // Aggiungi questo metodo all'interno della classe export class AppComponent { ... }

isAdmin(): boolean {
  const userJson = localStorage.getItem('user');
  if (!userJson) return false;
  
  try {
    const user = JSON.parse(userJson);
    return user && user.role === 'admin';
  } catch (e) {
    return false;
  }
}
}