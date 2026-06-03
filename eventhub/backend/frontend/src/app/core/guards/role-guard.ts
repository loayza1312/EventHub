import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const userRole = user ? user.role : 'guest';

  // Controlliamo il percorso della rotta per capire chi può passare
  const path = route.routeConfig?.path || '';

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // Blocchi di sicurezza sui ruoli basati sul percorso URL
  if (path.startsWith('admin') && userRole !== 'admin') {
    router.navigate(['/']);
    return false;
  }

  if (path.startsWith('organizer') && userRole !== 'organizer' && userRole !== 'admin') {
    router.navigate(['/']);
    return false;
  }

  return true;
};