import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayAddComponent } from './pathway-add.component';

describe('PathwayAddComponent', () => {
  let component: PathwayAddComponent;
  let fixture: ComponentFixture<PathwayAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathwayAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
