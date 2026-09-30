import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./search-form.component').then((m) => m.SearchFormComponent),
    data: {title: 'IPD Admitted Patients'},
  },
];