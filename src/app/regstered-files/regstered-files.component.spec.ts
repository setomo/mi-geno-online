import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegsteredFilesComponent } from './regstered-files.component';

describe('RegsteredFilesComponent', () => {
  let component: RegsteredFilesComponent;
  let fixture: ComponentFixture<RegsteredFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegsteredFilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegsteredFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
