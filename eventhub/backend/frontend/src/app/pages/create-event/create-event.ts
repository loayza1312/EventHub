import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-event.html'
})
export class CreateEventComponent {
  title = '';
  description = '';
  date = '';
  location = '';
  price = 0;
  total_slots = 50;
  category = 'Concerti';

  constructor(private http: HttpClient, private router: Router) {}

  onCreateEvent() {
    const payload = {
      title: this.title,
      description: this.description,
      date: this.date,
      location: this.location,
      price: this.price,
      total_slots: this.total_slots,
      category: this.category
    };

    this.http.post('https://glowing-tribble-pjpqvrj4w6rwc9p7g-5000.app.github.dev/api/events', payload).subscribe({
      next: () => {
        alert('Evento creato con successo!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('Errore durante la creazione dell\'evento.');
        console.error(err);
      }
    });
  }
}
