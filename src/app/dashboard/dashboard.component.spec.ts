import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RjobSearchComponent } from '../rjob-search/rjob-search.component';
import { RjobService } from '../rjob.service';
import { RJOBS } from '../mock-rjobs';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let rjobService;
  let getRjobsSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    rjobService = jasmine.createSpyObj('RjobService', ['getRjobs']);
    getRjobsSpy = rjobService.getRjobs.and.returnValue(of(RJOBS));
    TestBed
        .configureTestingModule({
          declarations: [DashboardComponent, RjobSearchComponent],
          imports: [RouterTestingModule.withRoutes([])],
          providers: [{provide: RjobService, useValue: rjobService}]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top rjobs" as headline', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual('Top rjobs');
  });

  it('should call rjobService', waitForAsync(() => {
       expect(getRjobsSpy.calls.any()).toBe(true);
     }));

  it('should display 4 links', waitForAsync(() => {
       expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
     }));
});
