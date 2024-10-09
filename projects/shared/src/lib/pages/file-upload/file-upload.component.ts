import { Component, inject } from '@angular/core';
import { convertToFrameFile } from '../../parsing/frames';
import { WatsonStoreService } from '../../services/watson-store.service';

@Component({
  selector: 'lib-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {

  private storeService = inject(WatsonStoreService);

  onFileSelected($event: Event) {
    const element = $event.target as HTMLInputElement;
    const fileList = element.files;
    if (fileList) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          this.storeService.setFrames(convertToFrameFile(e.target?.result));
        }
      }

      reader.readAsText(fileList[0])
    }
  }
  
}
