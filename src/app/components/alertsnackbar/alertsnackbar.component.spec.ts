import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsnackbarComponent } from './alertsnackbar.component';

describe('AlertsnackbarComponent', () => {
  let component: AlertsnackbarComponent;
  let fixture: ComponentFixture<AlertsnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertsnackbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
