import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSearchComponent } from './selected-search.component';

describe('SelectedSearchComponent', () => {
  let component: SelectedSearchComponent;
  let fixture: ComponentFixture<SelectedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectedSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
