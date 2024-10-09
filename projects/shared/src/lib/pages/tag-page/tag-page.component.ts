import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TagListComponent } from "../../components/tag-list/tag-list.component";
import { WATSON_DATA_PROVIDER_TOKEN } from '../../services/watson-data-provider.injection-token';

@Component({
  selector: 'lib-tag-page',
  standalone: true,
  imports: [TagListComponent],
  templateUrl: './tag-page.component.html',
  styleUrl: './tag-page.component.css'
})
export class TagPageComponent {

  dataProvider = inject(WATSON_DATA_PROVIDER_TOKEN);

  tagsSignal = toSignal(this.dataProvider.listTags(), {initialValue: []});

}
