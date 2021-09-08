import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityThingsComponent } from './security-things.component';

describe('SecurityThingsComponent', () => {
  let component: SecurityThingsComponent;
  let fixture: ComponentFixture<SecurityThingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityThingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityThingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
