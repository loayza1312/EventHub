import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  users: any[] = [];
  reportedComments: any[] = [];

  ngOnInit() {
    // Dati simulati degli utenti registrati nella piattaforma
    this.users = [
      { id: 1, username: 'mario_rossi', email: 'mario@email.com', role: 'user', status: 'attivo' },
      { id: 2, username: 'dj_festa', email: 'organizzatore@email.com', role: 'organizer', status: 'attivo' },
      { id: 3, username: 'troll_99', email: 'troll@email.com', role: 'user', status: 'attivo' }
    ];

    // Dati simulati dei commenti segnalati dagli utenti sugli eventi
    this.reportedComments = [
      { id: 101, user: 'troll_99', event: 'Rock in Roma 2026', text: 'Questo concerto fa schifo, non andateci!!!', reason: 'Spam / Linguaggio offensivo' },
      { id: 102, user: 'mario_rossi', event: 'Techno Night', text: 'Qualcuno vende un biglietto all\'ultimo minuto?', reason: 'Bagarinaggio / Fuori tema' }
    ];
  }

  // Azione: Cambia il ruolo di un utente
  promoteToOrganizer(user: any) {
    user.role = 'organizer';
    alert(`Utente ${user.username} promosso a Organizzatore!`);
  }

  // Azione: Banna o Attiva un utente
  toggleBanUser(user: any) {
    user.status = user.status === 'attivo' ? 'bannato' : 'attivo';
  }

  // Azione: Approva il commento (rimuove la segnalazione)
  approveComment(commentId: number) {
    this.reportedComments = this.reportedComments.filter(c => c.id !== commentId);
    alert('Segnalazione archiviata. Il commento è stato approvato.');
  }

  // Azione: Elimina definitivamente il commento
  deleteComment(commentId: number) {
    this.reportedComments = this.reportedComments.filter(c => c.id !== commentId);
    alert('Commento rimosso definitivamente dalla piattaforma.');
  }
}