import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';

interface SavedPdf {
  name: string;
  fileName: string;
  url: string;
}

@Component({
  selector: 'app-all-pdf-table',
  imports: [TableModule, Button],
  templateUrl: './all-pdf-table.component.html',
  styleUrl: './all-pdf-table.component.css',
})
export class AllPdfTableComponent {
  pdfs: SavedPdf[] = [];

  ngOnInit(): void {
    this.loadSavedPdfs();
  }

  loadSavedPdfs(): void {
    fetch('/pdfs.json')
      .then((response) => response.json())
      .then((data) => {
        this.pdfs = data;
      })
      .catch((error) => {
        console.error('Failed to load PDFs', error);
      });
  }

  openPdf(pdf: SavedPdf): void {
    window.open(pdf.url, '_blank');
  }
}
