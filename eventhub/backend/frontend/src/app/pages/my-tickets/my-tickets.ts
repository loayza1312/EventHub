import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- Fondamentale per far funzionare il routerLink nell'HTML

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule], // <-- Rimosso QRCodeComponent per eliminare il warning
  templateUrl: './my-tickets.html',
})
export class MyTickets implements OnInit {
  tickets: any[] = [];

  ngOnInit() {
    // 1. Leggiamo i biglietti prenotati dal localStorage
    const savedTickets = localStorage.getItem('my_booked_tickets');
    
    if (savedTickets) {
      this.tickets = JSON.parse(savedTickets);
    } else {
      this.tickets = [];
    }
  }
}