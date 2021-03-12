import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSearchResultsComponent } from './edit-search-results.component';

describe('EditSearchResultsComponent', () => {
  let component: EditSearchResultsComponent;
  let fixture: ComponentFixture<EditSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSearchResultsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
