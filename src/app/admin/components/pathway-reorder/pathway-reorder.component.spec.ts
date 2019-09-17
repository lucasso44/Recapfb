import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayReorderComponent } from './pathway-reorder.component';

describe('PathwayReorderComponent', () => {
  let component: PathwayReorderComponent;
  let fixture: ComponentFixture<PathwayReorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathwayReorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
