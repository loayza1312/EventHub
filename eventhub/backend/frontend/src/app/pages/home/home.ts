import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  events: any[] = [];
  comments: any[] = [];

  searchQuery: string = '';
  selectedCity: string = '';
  maxPrice: number | null = null;

  selectedEventForReview: number | string = '';
  newCommentText: string = '';
  newCommentRating: number = 5;

  private backendUrl = 'https://glowing-tribble-pjpqvrj4w6rwc9p7g-5000.app.github.dev';

  constructor() {}

  ngOnInit() {
    this.fetchEvents();
    this.fetchReviews();
  }

  fetchEvents() {
    fetch(`${this.backendUrl}/api/events`)
      .then(response => {
        if (!response.ok) throw new Error('Errore risposta server');
        return response.json();
      })
      .then(data => {
        this.events = Array.isArray(data) ? data : [];
        if (this.events.length > 0) {
          this.selectedEventForReview = this.events[0].id;
        }
      })
      .catch(error => {
        console.error('Inizializzazione eventi fallita:', error);
        this.events = [];
      });
  }

  fetchReviews() {
    fetch(`${this.backendUrl}/api/reviews`)
      .then(response => {
        if (!response.ok) throw new Error('Errore risposta server');
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          this.comments = data.map((review: any) => ({
            ...review,
            stars: '⭐'.repeat(Math.max(1, Math.min(5, Number(review.rating) || 5)))
          }));
        } else {
          this.comments = [];
        }
      })
      .catch(error => {
        console.error('Inizializzazione recensioni fallita:', error);
        this.comments = [];
      });
  }

  get filteredEvents(): any[] {
    if (!this.events || !Array.isArray(this.events)) {
      return [];
    }
    return this.events.filter(event => {
      if (!event) return false;
      const title = (event.title || '').toLowerCase();
      const description = (event.description || '').toLowerCase();
      const query = (this.searchQuery || '').toLowerCase();

      const matchesSearch = !query || title.includes(query) || description.includes(query);
      const matchesCity = !this.selectedCity || (event.location || '').toLowerCase() === this.selectedCity.toLowerCase();
      const matchesPrice = this.maxPrice === null || this.maxPrice === undefined || event.price <= this.maxPrice;

      return matchesSearch && matchesCity && matchesPrice;
    });
  }

  bookTicket(event: any) {
    if (!event) return;

    // 1. Controlliamo se l'utente esiste davvero nel LocalStorage
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userJson || !token) {
      // Se non è loggato, blocchiamo la prenotazione!
      alert('⚠️ Devi effettuare l\'accesso per poter prenotare un biglietto!');
      window.location.href = '/login'; // Lo spediamo al login
      return;
    }

    // 2. Se è loggato, recuperiamo i suoi dati reali
    const user = JSON.parse(userJson);

    // 3. Inviamo la richiesta reale al backend Flask
    fetch(`${this.backendUrl}/api/bookings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Inviamo il JWT reale
      },
      body: JSON.stringify({ user_id: user.id, event_id: event.id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(`❌ Errore: ${data.error}`);
      } else {
        alert(`🎟️ Prenotazione Riuscita!\nCodice Biglietto: ${data.ticketCode}`);
        if (event.capacity > 0) event.capacity--;
      }
    })
    .catch(err => console.error('Errore durante la prenotazione:', err));
  }

  addComment() {
    if (!this.newCommentText.trim() || !this.selectedEventForReview) {
      alert('⚠️ Compila tutti i campi della recensione.');
      return;
    }

    // Controllo Autenticazione Reale per le Recensioni
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userJson || !token) {
      alert('⚠️ Devi effettuare il login per poter rilasciare una recensione!');
      window.location.href = '/login';
      return;
    }

    // 🛡️ CONTROLLO DATA CRITICO: Verifica se l'evento si è già svolto
    const targetEvent = this.events.find(e => String(e.id) === String(this.selectedEventForReview));
    if (targetEvent) {
      const eventDate = new Date(targetEvent.date);
      const currentDate = new Date(); // Data corrente (Anno corrente 2026)

      if (eventDate > currentDate) {
        alert('❌ Requisito non soddisfatto: Non puoi recensire un evento futuro. Aspetta che l\'evento si sia concluso!');
        return;
      }
    }

    const user = JSON.parse(userJson);

    fetch(`${this.backendUrl}/api/reviews`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Header JWT di protezione
      },
      body: JSON.stringify({
        user_id: user.id,
        event_id: Number(this.selectedEventForReview),
        text: this.newCommentText,
        rating: Number(this.newCommentRating) || 5,
        username: user.username
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Impossibile salvare la recensione. Controlla i dati o la data dell\'evento.');
      return res.json();
    })
    .then(data => {
      this.comments.unshift({
        author: data.author || user.username,
        eventTitle: data.eventTitle || (targetEvent ? targetEvent.title : 'Evento'),
        text: data.text || this.newCommentText,
        rating: data.rating || Number(this.newCommentRating),
        stars: '⭐'.repeat(data.rating || Number(this.newCommentRating)),
        date: data.date || new Date().toLocaleDateString('it-IT')
      });
      this.newCommentText = '';
      alert('🎉 Recensione pubblicata con successo sul database!');
    })
    .catch(err => {
      console.error("Errore nell'invio del commento:", err);
      alert(`❌ Errore d'invio: ${err.message}`);
    });
  }
}