import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-tag-list',
  standalone: true,
  imports: [],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss'
})
export class TagListComponent {

  tags = input<Array<string>>()

}
