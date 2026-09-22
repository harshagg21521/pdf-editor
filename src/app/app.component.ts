import { Component } from '@angular/core';
import { PdfEditorDemoComponent } from './pdf-editor-demo/pdf-editor-demo.component';


@Component({
  selector: 'app-root',
  imports: [PdfEditorDemoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ngx-pdf-editor-demo';
}
