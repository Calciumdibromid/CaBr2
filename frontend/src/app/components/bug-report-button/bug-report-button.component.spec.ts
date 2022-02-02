import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugReportButtonComponent } from './bug-report-button.component';

describe('BugReportButtonComponent', () => {
  let component: BugReportButtonComponent;
  let fixture: ComponentFixture<BugReportButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BugReportButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BugReportButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
