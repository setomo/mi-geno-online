import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefRegistrationComponent } from './ref-registration.component';

describe('RefRegistrationComponent', () => {
  let component: RefRegistrationComponent;
  let fixture: ComponentFixture<RefRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
