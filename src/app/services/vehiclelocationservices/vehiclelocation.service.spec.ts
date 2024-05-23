import { TestBed } from '@angular/core/testing';

import { VehiclelocationService } from './vehiclelocation.service';

describe('VehiclelocationService', () => {
  let service: VehiclelocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclelocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
