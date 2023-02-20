import { TestBed } from '@angular/core/testing';
import { JobManageServiceService } from './job-manage-service.service';

describe('JobManageServiceService', () => {
  let service: JobManageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobManageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
