import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  output,
  Signal,
} from '@angular/core';
import {
  CustomSeriesOption,
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemReturn,
  ECElementEvent,
  EChartsOption,
  graphic,
} from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { Log } from '../../parsing/log';

@Component({
  selector: 'lib-log-timeline',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './log-timeline.component.html',
  styleUrl: './log-timeline.component.css',
  providers: [DatePipe, provideEcharts()],
})
export class LogTimelineComponent {
  log = input<Array<Log>>();
  frameClicked = output<string>();

  private datePipe = inject(DatePipe);
  private tooltipFormat = 'mediumTime'; // https://angular.dev/api/common/DatePipe?tab=usage-notes

  option: Signal<EChartsOption> = computed(() => {
    const log = this.log() ?? [];

    const projects = log.map((l) => l.project).filter(this.onlyUnique);

    let minDate = new Date();
    let maxDate = new Date(0);

    const series: Array<CustomSeriesOption> = projects.map((p) => {
      const logs = log.filter((l) => l.project === p);
      return {
        type: 'custom',
        renderItem: this.renderItem,
        data: logs.map((l) => {
          const end = l.stop ?? new Date();

          if (minDate.getTime() > l.start.getTime()) {
            minDate = l.start;
          }
          if (maxDate.getTime() < end.getTime()) {
            maxDate = end;
          }

          return {
            name: l.tags.join(','),
            value: [
              l.start.getTime(), // start
              end.getTime(), // end
              projects.indexOf(l.project), // index
              l.id // log-id
            ],
          };
        }),
      };
    });

    // create new dates to prevent existing values tp be changed by reference
    minDate = new Date(minDate);
    minDate.setHours(minDate.getHours() - 1);
    maxDate = new Date(maxDate);
    maxDate.setHours(maxDate.getHours() + 1);

    const options: EChartsOption = {
      title: {
        text: 'Todays log'
      },
      grid: {
        containLabel: true
      },
      yAxis: {
        type: 'category',
        data: projects,
      },
      xAxis: {
        type: 'time',
        min: minDate.getTime(),
        max: maxDate.getTime(),
        axisLine: {
          show: true
        },
        splitLine: {
          show: true
        }
      },
      series: series,
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: (params) => {
          // @ts-ignore
          return `${params.marker} ${params.name} (${this.datePipe.transform(new Date(params.value[0]), this.tooltipFormat)} - ${this.datePipe.transform(new Date(params.value[1]), this.tooltipFormat)})`
        }
      }
    }

    return options;
  });

  private renderItem = (
    params: CustomSeriesRenderItemParams,
    api: CustomSeriesRenderItemAPI
  ): CustomSeriesRenderItemReturn => {
    const index = api.value(2);
    const timespan = [api.value(0), api.value(1)];
    const start = api.coord([timespan[0], index]); // highest index - index (2 - index)
    const end = api.coord([timespan[1], index]);
    // @ts-ignore
    const size: Array<number> = api.size([0, 1]);
    const height = size[1] * 0.6;
    // console.log({
    //   start: api.value(0),
    //   end: api.value(1),
    //   timespan: timespan,
    //   size: size,
    //   height: height
    // })
    const rect = graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height
      },
      {
        // @ts-ignore
        x: params.coordSys.x,
        // @ts-ignore
        y: params.coordSys.y,
        // @ts-ignore
        width: params.coordSys.width,
        // @ts-ignore
        height: params.coordSys.height,
      }
    );
    return {
      type: 'rect',
      transition: ['shape'],
      shape: rect,
      style: {
        fill: api.visual('color')
      },
    };
  };

  private onlyUnique = (value: any, index: number, array: Array<any>) => {
    return array.indexOf(value) === index;
  };

  chartClicked($event: ECElementEvent) {
    // @ts-ignore
    this.frameClicked.emit($event.value[3])
  }


}
