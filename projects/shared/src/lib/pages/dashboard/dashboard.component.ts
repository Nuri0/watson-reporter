import { DatePipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { LogTimelineComponent } from "../../components/log-timeline/log-timeline.component";
import { Log } from '../../parsing/log';
import { WATSON_DATA_PROVIDER_TOKEN } from '../../services/watson-data-provider.injection-token';
import { WatsonDataProviderService } from '../../services/watson-data-provider.service';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [NgxEchartsDirective, LogTimelineComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [
    DatePipe,
    provideEcharts()
  ]
})
export class DashboardComponent {

  dataProvider: WatsonDataProviderService = inject(WATSON_DATA_PROVIDER_TOKEN);
  todaysLog: Signal<Array<Log>> = toSignal(this.dataProvider.getTodaysLog(), {initialValue: []})

  frameClicked(frameId: string) {
    this.dataProvider.editLog(frameId).subscribe();
  }
}
