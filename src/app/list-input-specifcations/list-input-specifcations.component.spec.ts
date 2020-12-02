import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInputSpecifcationsComponent } from './list-input-specifcations.component';

describe('ListInputSpecifcationsComponent', () => {
  let component: ListInputSpecifcationsComponent;
  let fixture: ComponentFixture<ListInputSpecifcationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInputSpecifcationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInputSpecifcationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
