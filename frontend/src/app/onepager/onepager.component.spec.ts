import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnePagerComponent } from './onepager.component';

describe('OnepagerComponent', () => {
  let component: OnePagerComponent;
  let fixture: ComponentFixture<OnePagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnePagerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnePagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
