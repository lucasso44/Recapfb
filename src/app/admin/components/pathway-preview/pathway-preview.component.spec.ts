import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayPreviewComponent } from './pathway-preview.component';

describe('PathwayPreviewComponent', () => {
  let component: PathwayPreviewComponent;
  let fixture: ComponentFixture<PathwayPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathwayPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
