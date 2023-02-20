import { TestBed, async } from '@angular/core/testing';
import { DragdropComponent } from './dragdrop.component';

describe('DragdropComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DragdropComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DragdropComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'dnd'`, () => {
    const fixture = TestBed.createComponent(DragdropComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('dnd');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(DragdropComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('dnd app is running!');
  });
});
