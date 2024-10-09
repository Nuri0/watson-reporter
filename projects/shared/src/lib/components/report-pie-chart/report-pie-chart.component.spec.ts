import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPieChartComponent } from './report-pie-chart.component';

describe('ReportPieChartComponent', () => {
  let component: ReportPieChartComponent;
  let fixture: ComponentFixture<ReportPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPieChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
