import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  events: any[] = [];
  comments: any[] = [];
  newCommentText: string = '';

  ngOnInit() {
    // Lista di eventi simulati per riempire la griglia grafica
    this.events = [
      { id: 1, title: 'Concerto Rock Live', desc: 'Il grande ritorno della musica dal vivo in uno stadio infuocato.', date: '2026-06-15', location: 'Milano', price: 15.00, capacity: 147 },
      { id: 2, title: 'Techno Night Clubbing', desc: 'I migliori DJ internazionali della scena underground.', date: '2026-08-22', location: 'Roma', price: 20.00, capacity: 60 },
      { id: 3, title: 'Pop Festival 2026', desc: 'Tre giorni di pura energia con le hit estive del momento.', date: '2026-07-05', location: 'Firenze', price: 35.00, capacity: 250 }
    ];

    // Commenti iniziali visibili sulla piattaforma
    this.comments = [
      { id: 1, user: 'mario_rossi', text: 'Il concerto rock dell\'anno scorso è stato incredibile! Ci tornerò di sicuro.', date: '2026-06-01' },
      { id: 2, user: 'luca_bianchi', text: 'Prezzi dei biglietti onestissimi per la Techno Night.', date: '2026-06-02' }
    ];
  }

 bookTicket(event: any) {
  if (event.capacity > 0) {
    event.capacity--;

    // 1. Recuperiamo i biglietti già salvati nel localStorage (se esistono), altrimenti creiamo un array vuoto
    const existingTicketsJson = localStorage.getItem('my_booked_tickets');
    const myTickets = existingTicketsJson ? JSON.parse(existingTicketsJson) : [];

    // 2. Generiamo un nuovo biglietto dinamico basato sull'evento cliccato
    const randomTicketId = 'TKT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newTicket = {
      id: randomTicketId,
      title: event.title,
      date: event.date,
      location: event.location + ', Stadio / Arena',
      seat: 'Posto Unico - Prato Gold',
      ticketCode: randomTicketId
    };

    // 3. Aggiungiamo il nuovo biglietto in cima alla lista e salviamo nel browser
    myTickets.unshift(newTicket);
    localStorage.setItem('my_booked_tickets', JSON.stringify(myTickets));

    alert(`🎉 Biglietto prenotato con successo per: ${event.title}!\nTroverai il tuo QR Code nella sezione "I Miei Biglietti".`);
  } else {
    alert('⚠️ Sold Out! Posti esauriti per questo evento.');
  }
}

  // Aggiungi un nuovo commento dal box in basso
  addComment() {
    if (!this.newCommentText.trim()) return;

    const userJson = localStorage.getItem('user');
    const username = userJson ? JSON.parse(userJson).username : 'Utente_Anonimo';

    this.comments.unshift({
      id: this.comments.length + 1,
      user: username,
      text: this.newCommentText,
      date: 'Oggi'
    });

    this.newCommentText = '';
  }
}