import { TestBed } from '@angular/core/testing';

import { WatsonStoreService } from './watson-store.service';

describe('WatsonStoreService', () => {
  let service: WatsonStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatsonStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
