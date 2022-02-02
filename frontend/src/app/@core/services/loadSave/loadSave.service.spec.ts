import { TestBed } from '@angular/core/testing';

import { LoadSaveService } from './loadSave.service';

describe('LoadSaveService', () => {
  let service: LoadSaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadSaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
