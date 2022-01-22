import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiableStringListComponent } from './modifiable-string-list.component';

describe('ModifiableStringListComponent', () => {
  let component: ModifiableStringListComponent;
  let fixture: ComponentFixture<ModifiableStringListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifiableStringListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifiableStringListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
