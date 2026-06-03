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
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : { id: 1, username: 'mirko' };

    fetch(`${this.backendUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, event_id: event.id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(`❌ Errore: ${data.error}`);
      } else {
        alert(`🎟️ Prenotazione Riuscita!\nCodice: ${data.ticketCode}`);
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

    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : { id: 1, username: 'mirko' };

    fetch(`${this.backendUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        event_id: Number(this.selectedEventForReview),
        text: this.newCommentText,
        rating: Number(this.newCommentRating) || 5,
        username: user.username
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Impossibile salvare la recensione');
      return res.json();
    })
    .then(data => {
      this.comments.unshift({
        author: data.author,
        eventTitle: data.eventTitle,
        text: data.text,
        rating: data.rating,
        stars: '⭐'.repeat(data.rating),
        date: data.date
      });
      this.newCommentText = '';
      alert('🎉 Recensione pubblicata!');
    })
    .catch(err => console.error("Errore nell'invio del commento:", err));
  }
}