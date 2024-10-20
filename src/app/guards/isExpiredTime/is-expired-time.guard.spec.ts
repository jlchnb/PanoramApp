import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isExpiredTimeGuard } from './is-expired-time.guard';

describe('isExpiredTimeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isExpiredTimeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
