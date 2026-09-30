import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { MessageService, ConfirmationService } from 'primeng/api';

import {
  NgxExtendedPdfViewerService,
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerComponent,
  PdfImageParameters,
} from 'ngx-extended-pdf-viewer';
import { ActivatedRoute, Router } from '@angular/router';

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
    ButtonModule,
    TableModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    NgxExtendedPdfViewerModule,
    CardModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './pdf-editor-demo.component.html',
})
export class PdfEditorDemoComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private savedImagePath = '/my-saved-image.png';

  pdfUrl: string = '';

  imageParams: PdfImageParameters = {
    urlOrDataUrl: '',
    page: 0,
    left: 100,
    bottom: 200,
    right: 250,
    top: 300,
    rotation: 0,
  };

  pdfSrc = signal<string>('');
  originalFilename = signal<string>('');
  filename = signal<string>('');

  savedPdfs = signal<SavedPdf[]>([]);

  IPD: string = 'IPD-MLD-2026-2027-2857';
  OT_ID: string = 'OT-ID-1';

  private pdfViewerService = inject(NgxExtendedPdfViewerService);

  private directoryHandle: FileSystemDirectoryHandle | null = null;

  @ViewChild('pdfViewer')
  public pdfViewerComponent!: NgxExtendedPdfViewerComponent;

  ngOnInit(): void {
    this.pdfUrl = this.activatedRoute.snapshot.paramMap.get('url') || '';
    // this.pdfUrl = '/ot-form-1.pdf';
    this.loadPdf(this.pdfUrl);
  }

  /**
   * Load PDF from project/public folder
   */
  loadPdf(url: string): void {
    this.pdfSrc.set(url);

    const fileName = this.getFileNameFromUrl(url);
    const pdfName = fileName.replace(/\.pdf$/i, '') + '.pdf';

    this.originalFilename.set(pdfName);
    this.filename.set(pdfName);
  }

  /**
   * Extract file name from URL
   */
  private getFileNameFromUrl(url: string): string {
    const cleanUrl = url.split('?')[0];

    return cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);
  }

  /**
   * Select folder where edited PDFs will be stored
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
      alert('Please open a PDF first.');
      return;
    }

    if (!this.directoryHandle) {
      await this.selectSaveFolder();

      if (!this.directoryHandle) {
        return;
      }
    }

    try {
      const pdfBlob = await this.pdfViewerService.getCurrentDocumentAsBlob();

      if (!pdfBlob) {
        alert('Unable to generate edited PDF.');
        return;
      }

      // Generate final filename
      const savedFileName = this.renamePdfFile(this.originalFilename());

      // Create file using final filename
      const fileHandle = await this.directoryHandle.getFileHandle(
        savedFileName,
        {
          create: true,
        },
      );

      // Write PDF
      const writable = await fileHandle.createWritable();

      await writable.write(pdfBlob);
      await writable.close();

      // Update table
      const existing = this.savedPdfs().filter(
        (pdf) => pdf.name !== savedFileName,
      );

      this.savedPdfs.set([
        ...existing,
        {
          name: savedFileName,
          size: pdfBlob.size,
          savedAt: new Date(),
          handle: fileHandle,
        },
      ]);

      // Keep filename consistent
      this.filename.set(savedFileName);

      alert('Edited PDF saved successfully.');
      this.router.navigate(['all']);
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Failed to save PDF.');
    }
  }

  /**
   * Open saved PDF
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
   * Delete saved PDF
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

      if (this.filename() === pdf.name) {
        this.pdfSrc.set('');
        this.filename.set('');
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);

      alert('Unable to delete PDF.');
    }
  }

  public async addSavedImage(): Promise<void> {
    try {
      const response = await fetch(this.savedImagePath);
      const blob = await response.blob();
      this.imageParams.urlOrDataUrl = this.savedImagePath;

      if (this.pdfViewerComponent) {
        this.pdfViewerService.addImageToAnnotationLayer(this.imageParams);
      } else {
        console.error('PDF Viewer component or service is not ready.');
      }
    } catch (error) {
      console.error('Failed to load project image:', error);
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
