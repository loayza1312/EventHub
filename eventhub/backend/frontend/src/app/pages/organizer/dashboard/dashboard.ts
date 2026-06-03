import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 Importante per far funzionare i campi del form!

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 Aggiunto FormsModule qui
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  events: any[] = [];
  totalEarnings = 0;
  totalTicketsSold = 0;

  // Variabili di appoggio per il nuovo evento legato al Form
  newEvent = {
    title: '',
    date: '',
    ticketPrice: 0,
    maxCapacity: 100
  };

  ngOnInit() {
    this.events = [
      {
        id: 1,
        title: 'Rock in Roma 2026',
        date: '2026-07-15',
        ticketPrice: 45.00,
        ticketsSold: 120,
        maxCapacity: 500,
        attendees: [
          { name: 'Mario Rossi', email: 'mario.rossi@email.com', ticketCode: 'TKT-RR-01', date: '2026-05-10' }
        ]
      },
      {
        id: 2,
        title: 'Techno Night Clubbing',
        date: '2026-08-22',
        ticketPrice: 20.00,
        ticketsSold: 340,
        maxCapacity: 400,
        attendees: [
          { name: 'Alessandro Neri', email: 'ale.neri@email.com', ticketCode: 'TKT-TN-01', date: '2026-05-01' }
        ]
      }
    ];
    this.calculateTotals();
  }

  calculateTotals() {
    this.totalEarnings = this.events.reduce((sum, event) => sum + (event.ticketsSold * event.ticketPrice), 0);
    this.totalTicketsSold = this.events.reduce((sum, event) => sum + event.ticketsSold, 0);
  }

  // 🚀 NUOVA FUNZIONE: Prende i dati dal form e crea l'evento in tempo reale
  createEvent() {
    if (!this.newEvent.title || !this.newEvent.date || this.newEvent.ticketPrice <= 0) {
      alert('Per favore, compila tutti i campi correttamente.');
      return;
    }

    const createdEvent = {
      id: this.events.length + 1,
      title: this.newEvent.title,
      date: this.newEvent.date,
      ticketPrice: this.newEvent.ticketPrice,
      ticketsSold: 0, // Appena creato ha 0 vendite
      maxCapacity: this.newEvent.maxCapacity,
      attendees: [] // Nessun iscritto inizialmente
    };

    this.events.push(createdEvent);
    this.calculateTotals(); // Ricalcola i guadagni totali della dashboard

    // Resetta il form
    this.newEvent = { title: '', date: '', ticketPrice: 0, maxCapacity: 100 };
    alert('🎉 Evento creato con successo!');
  }

  exportToCSV(event: any) {
    const headers = ['Nome Partecipante', 'Email', 'Codice Biglietto', 'Data Acquisto'];
    const rows = event.attendees.map((a: any) => [
      `"${a.name}"`, `"${a.email}"`, `"${a.ticketCode}"`, `"${a.date}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `Iscritti_${event.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}