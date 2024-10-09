import { TestBed } from '@angular/core/testing';

import { WatsonCliService } from './watson-cli.service';

describe('WatsonCliService', () => {
  let service: WatsonCliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatsonCliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
