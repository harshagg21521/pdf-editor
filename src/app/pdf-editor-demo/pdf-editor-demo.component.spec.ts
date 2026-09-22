import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfEditorDemoComponent } from './pdf-editor-demo.component';

describe('PdfEditorDemoComponent', () => {
  let component: PdfEditorDemoComponent;
  let fixture: ComponentFixture<PdfEditorDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfEditorDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfEditorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
