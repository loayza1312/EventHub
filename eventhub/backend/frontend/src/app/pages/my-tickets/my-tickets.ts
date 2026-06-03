import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './my-tickets.html', // o './my-tickets.component.html' a seconda del tuo file
})
export class MyTickets implements OnInit {
  tickets: any[] = [];

ngOnInit() {
    // 1. Leggiamo i biglietti prenotati dal localStorage
    const savedTickets = localStorage.getItem('my_booked_tickets');
    
    if (savedTickets) {
      this.tickets = JSON.parse(savedTickets);
    } else {
      // 2. Se non abbiamo ancora prenotato nulla, lasciamo la lista vuota o un messaggio
      this.tickets = [];
    }
  }
}