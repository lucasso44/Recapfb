import { TestBed } from '@angular/core/testing';

import { PathwayService } from './pathway.service';

describe('PathwayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PathwayService = TestBed.get(PathwayService);
    expect(service).toBeTruthy();
  });
});
