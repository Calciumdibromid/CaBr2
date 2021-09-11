import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubstanceDataComponent } from './edit-substance-data.component';

describe('EditSearchResultsComponent', () => {
  let component: EditSubstanceDataComponent;
  let fixture: ComponentFixture<EditSubstanceDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSubstanceDataComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubstanceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
