import { TestBed } from '@angular/core/testing';

import { SubstancesService } from './substances.service';

describe('SubstancesService', () => {
  let service: SubstancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubstancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
