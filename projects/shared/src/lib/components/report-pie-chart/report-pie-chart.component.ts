import { Component, computed, input, Signal } from '@angular/core';
import { ECElementEvent, ECharts, EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { Report } from '../../parsing/report';

@Component({
  selector: 'lib-report-pie-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './report-pie-chart.component.html',
  styleUrl: './report-pie-chart.component.scss',
  providers: [provideEcharts()],
})
export class ReportPieChartComponent {

  report = input<Report>();
  chartInstance: ECharts | null = null;

  onChartInit($event: ECharts) {
    this.chartInstance = $event;
  }


  optionSignal: Signal<EChartsOption | null> = computed(() => {
    const report = this.report();

    if (!report) {
      return null;
    }

    return {
      legend: {
        orient: 'vertical',
        right: '10%',
        top: 'middle'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          // @ts-ignore
          return new Date(params.value * 1000).toISOString().slice(11, 19);
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          // radius: '50%',
          data: report.projects.map((p) => ({
            name: p.name,
            value: p.time,
          })),
        },
      ],
    };
  });

  chartClicked($event: ECElementEvent) {
    // TODO get data typed
    // @ts-ignore
    const project = this.report()?.projects.filter(p => p.name === $event.data?.name)[0];
    const tags = project?.tags;

    if (!tags || tags.length === 0) {
      return;
    }

    if (!this.chartInstance) {
      return;
    }

    const newOptions: EChartsOption = {
      title: {
        text: project.name,
        left: 'center'
      },
      series: {
        data: tags.map(t => ({
          name: t.name,
          value: t.time
        }))
      },
      graphic: [{
        type: 'text',
        left: 50,
        top: 20,
        style: {
          text: 'Back',
          fontSize: 19
        },
        onclick: () => this.chartInstance?.setOption(this.optionSignal()!, true)
      }]
    }

    this.chartInstance.setOption(newOptions)
  }
}
