import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTimelineComponent } from './log-timeline.component';

describe('LogTimelineComponent', () => {
  let component: LogTimelineComponent;
  let fixture: ComponentFixture<LogTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
