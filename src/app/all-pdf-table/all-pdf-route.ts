import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./all-pdf-table.component').then((m) => m.AllPdfTableComponent),
    
  },
];