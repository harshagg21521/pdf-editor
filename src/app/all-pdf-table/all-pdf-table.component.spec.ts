import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPdfTableComponent } from './all-pdf-table.component';

describe('AllPdfTableComponent', () => {
  let component: AllPdfTableComponent;
  let fixture: ComponentFixture<AllPdfTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPdfTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPdfTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
