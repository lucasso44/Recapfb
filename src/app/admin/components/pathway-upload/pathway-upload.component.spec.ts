import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayUploadComponent } from './pathway-upload.component';

describe('PathwayUploadComponent', () => {
  let component: PathwayUploadComponent;
  let fixture: ComponentFixture<PathwayUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathwayUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
