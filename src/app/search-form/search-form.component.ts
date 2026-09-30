import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-search-form',
  imports: [SelectModule, CommonModule, FormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
})
export class SearchFormComponent {
  private router = inject(Router);
  selectedForm: string | null = null;

  forms: {name: string; url: string}[] = [
    {
      name: 'OT Form 1',
      url: '/ot-form-1.pdf',
    },
    {
      name: 'OT Form 2',
      url: '/ot-form-2.pdf',
    },
    {
      name: 'OT Form 3',
      url: '/ot-form-3.pdf',
    },
    {
      name: 'Pre Operative Form',
      url: '/ot-form-1.pdf',
    },
    {
      name: 'Anaesthetic Form',
      url: '/ot-form-2.pdf',
    },
    {
      name: 'Post Operative Form',
      url: '/ot-form-3.pdf',
    },
    {
      name: 'Progressive Note Form',
      url: '/ot-form-1.pdf',
    },
    {
      name: 'Consent Form',
      url: '/ot-form-2.pdf',
    },
    {
      name: 'Surgical Safety Checklist',
      url: '/ot-form-3.pdf',
    },
    {
      name: 'Operation Record',
      url: '/ot-form-1.pdf',
    },
  ];
  onFormSelect(event: any): void {
    console.log(this.selectedForm);

    this.router.navigate([
      '/pdf-demo',
      'show',
      {
        url: this.selectedForm,
      },
    ]);
  }
}
