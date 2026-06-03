import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  // Sostituisci questo URL con il tuo esatto indirizzo di Codespaces del backend (porta 5000 o 5001)
  private apiUrl = 'https://glowing-tribble-pjpqvrj4w6rwc9p7g-5000.app.github.dev/api';

  // Stato reattivo globale dell'utente
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private userSubject = new BehaviorSubject<any | null>(JSON.parse(localStorage.getItem('user') || 'null'));

  token$ = this.tokenSubject.asObservable();
  user$ = this.userSubject.asObservable();

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          // Decodifichiamo manualmente il JWT base64 per estrarre il ruolo e i dati dell'utente
          const payload = JSON.parse(atob(res.token.split('.')[1]));
          
          const userData = {
            id: payload.user_id,
            username: res.username,
            role: payload.role || 'user' // Default su 'user' se manca
          };

          localStorage.setItem('user', JSON.stringify(userData));
          this.tokenSubject.next(res.token);
          this.userSubject.next(userData);
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  getUserRole(): string {
    return this.userSubject.value ? this.userSubject.value.role : 'guest';
  }

  getUsername(): string {
    return this.userSubject.value ? this.userSubject.value.username : '';
  }
}