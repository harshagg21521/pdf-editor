import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pdf-demo',
    loadComponent: () =>
      import('./pdf-editor-demo.component').then((m) => m.PdfEditorDemoComponent),
    data: {title: 'IPD Admitted Patients'},
  },
];