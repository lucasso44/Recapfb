import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayRecordComponent } from './pathway-record.component';

describe('PathwayRecordComponent', () => {
  let component: PathwayRecordComponent;
  let fixture: ComponentFixture<PathwayRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathwayRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
