import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcfRegistrationComponent } from './vcf-registration.component';

describe('VcfRegistrationComponent', () => {
  let component: VcfRegistrationComponent;
  let fixture: ComponentFixture<VcfRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VcfRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VcfRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
