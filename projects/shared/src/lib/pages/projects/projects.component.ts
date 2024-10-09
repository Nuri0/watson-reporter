import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectListComponent } from "../../components/project-list/project-list.component";
import { ReportPieChartComponent } from "../../components/report-pie-chart/report-pie-chart.component";
import { WATSON_DATA_PROVIDER_TOKEN } from './../../services/watson-data-provider.injection-token';

@Component({
  selector: 'lib-projects',
  standalone: true,
  imports: [ProjectListComponent, JsonPipe, ReportPieChartComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {

  dataLoader = inject(WATSON_DATA_PROVIDER_TOKEN);

  projectsSignal = toSignal(this.dataLoader.listProjects(), {initialValue: []})
  projectTimesThisMonthSignal = toSignal(this.dataLoader.getProjectTimesForCurrentMonth(), {initialValue: null})

}
