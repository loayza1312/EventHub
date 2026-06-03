import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // <-- ASSICURATI CHE CI SIA QUESTO

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // <-- INSERISCILI ENTRAMBI QUI DENTRO
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  
  ngOnInit() {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsername(): string {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.username || 'Utente';
    }
    return 'Utente';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
}