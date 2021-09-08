import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollbuttonComponent } from './scrollbutton.component';

describe('ScrollbuttonComponent', () => {
  let component: ScrollbuttonComponent;
  let fixture: ComponentFixture<ScrollbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollbuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
