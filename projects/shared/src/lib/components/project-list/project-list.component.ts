import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-project-list',
  standalone: true,
  imports: [],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent {

  @Input()
  projects: Array<string> = [];
  // projects: Signal<Array<string>> = input.required<Array<string>>();

}
