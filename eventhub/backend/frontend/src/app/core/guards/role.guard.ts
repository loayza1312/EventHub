import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const roleGuard = (expectedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getUserRole();

    if (authService.isLoggedIn() && expectedRoles.includes(userRole)) {
      return true; // Accesso consentito
    }

    // Se non ha i permessi, lo rispediamo alla Home
    router.navigate(['/']);
    return false;
  };
};