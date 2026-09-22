import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { MessageService, ConfirmationService } from 'primeng/api';

interface SavedPdf {
  name: string;
  size: number;
  savedAt: Date;
  handle: FileSystemFileHandle;
}

@Component({
  selector: 'app-pdf-editor',
  standalone: true,
  imports: [
    CommonModule,
    NgxExtendedPdfViewerModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService, NgxExtendedPdfViewerService],
  templateUrl: './pdf-editor-demo.component.html',
})
export class PdfEditorDemoComponent {
  pdfSrc = signal<string>('');

  filename = signal<string>('');

  savedPdfs = signal<SavedPdf[]>([]);
  IPD: string = 'IPD-MLD-2026-2027-2857';
  OT_ID: string = 'OT-ID-1';

  private selectedFile: File | null = null;

  private directoryHandle: FileSystemDirectoryHandle | null = null;

  constructor(private pdfViewerService: NgxExtendedPdfViewerService) {}

  /**
   * Select original PDF
   */
  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }

    this.selectedFile = file;

    this.filename.set(file.name.replace(/\.pdf$/i, '') + '-edited.pdf');

    const url = URL.createObjectURL(file);

    this.pdfSrc.set(url);
  }

  /**
   * Select the folder where edited PDFs will be stored.
   */
  async selectSaveFolder(): Promise<void> {
    try {
      this.directoryHandle = await (window as any).showDirectoryPicker({
        mode: 'readwrite',
      });

      alert('Save folder selected successfully.');
    } catch (error) {
      console.log('Folder selection cancelled.');
    }
  }

  /**
   * Save edited PDF
   */
  async savePdf(): Promise<void> {
    if (!this.pdfSrc()) {
      alert('Please upload a PDF first.');
      return;
    }

    if (!this.directoryHandle) {
      await this.selectSaveFolder();

      if (!this.directoryHandle) {
        return;
      }
    }

    try {
      /**
       * Get the CURRENT PDF from
       * ngx-extended-pdf-viewer.
       *
       * This is important because it contains
       * the changes made using Draw Editor.
       */
      const pdfBlob = await this.pdfViewerService.getCurrentDocumentAsBlob();

      if (!pdfBlob) {
        alert('Unable to generate edited PDF.');
        return;
      }

      /**
       * Create file inside selected folder.
       */
      const fileHandle = await this.directoryHandle.getFileHandle(
        this.filename(),
        {
          create: true,
        },
      );

      /**
       * Write edited PDF.
       */
      const writable = await fileHandle.createWritable();

      await writable.write(pdfBlob);

      await writable.close();

      /**
       * Add/update table entry.
       */
      const existing = this.savedPdfs().filter(
        (pdf) => pdf.name !== this.filename(),
      );

      this.savedPdfs.set([
        ...existing,
        {
          name: this.renamePdfFile(this.filename()),
          size: pdfBlob.size,
          savedAt: new Date(),
          handle: fileHandle,
        },
      ]);

      alert('Edited PDF saved successfully.');
    } catch (error) {
      console.error('Error saving PDF:', error);

      alert('Failed to save PDF.');
    }
  }

  /**
   * Open a saved PDF from the selected folder.
   */
  async viewPdf(pdf: SavedPdf): Promise<void> {
    try {
      const file = await pdf.handle.getFile();

      const url = URL.createObjectURL(file);

      this.pdfSrc.set(url);

      this.filename.set(pdf.name);
    } catch (error) {
      console.error('Error opening PDF:', error);

      alert('Unable to open PDF.');
    }
  }

  /**
   * Delete saved PDF.
   */
  async deletePdf(pdf: SavedPdf): Promise<void> {
    if (!this.directoryHandle) {
      return;
    }

    try {
      await this.directoryHandle.removeEntry(pdf.name);

      this.savedPdfs.set(
        this.savedPdfs().filter((item) => item.name !== pdf.name),
      );

      /**
       * If currently opened PDF is deleted,
       * clear viewer.
       */
      if (this.filename() === pdf.name) {
        this.pdfSrc.set('');
        this.filename.set('');
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);

      alert('Unable to delete PDF.');
    }
  }

  /**
   * Rename File.
   */
  private renamePdfFile(filename: string): string {
    const extension = filename.substring(filename.lastIndexOf('.'));

    const name = filename.substring(0, filename.lastIndexOf('.'));

    return `${name}_${this.IPD}_${this.OT_ID}${extension}`;
  }
}
