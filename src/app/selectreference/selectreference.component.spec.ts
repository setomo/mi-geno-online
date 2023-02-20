import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectreferenceComponent } from './selectreference.component';

describe('SelectreferenceComponent', () => {
  let component: SelectreferenceComponent;
  let fixture: ComponentFixture<SelectreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
