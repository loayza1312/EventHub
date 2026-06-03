import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  // Nota: Questo servizio non ha un template visivo, gestisce solo i dati
})
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // L'URL di base del tuo server Flask (modifica la porta se il tuo backend gira su un'altra porta)
  private apiUrl = 'http://127.0.0.1:5000/api'; 

  constructor(private http: HttpClient) {}

  // Funzione per inviare i dati di registrazione a Flask
  register(username: string, email: string, password: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  // Funzione per inviare le credenziali di login e salvare il token JWT ricevuto
  login(email: string, password: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          // Salva il token di sessione nel browser dell'utente
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // Funzione per verificare se l'utente è loggato
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Funzione per disconnettersi svuotando la sessione
  logout() {
    localStorage.removeItem('token');
  }
}