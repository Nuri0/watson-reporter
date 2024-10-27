import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MtxNativeDatetimeModule, provideNativeDatetimeAdapter } from '@ng-matero/extensions/core';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { Frame } from '../../parsing/frames';
import { ModelFormGroup } from '../../util/forms';

export interface FrameDialogInput {
  frame: Frame,
  projects: Array<string>,
  tags: Array<string>
}

@Component({
  selector: 'lib-frame-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MtxDatetimepickerModule, MatSelectModule, MtxNativeDatetimeModule ],
  templateUrl: './frame-dialog.component.html',
  styleUrl: './frame-dialog.component.scss',
  providers: [
    provideNativeDatetimeAdapter()
  ]
})
export class FrameDialogComponent {
  data: FrameDialogInput = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);

  form: ModelFormGroup<Frame>

  constructor() {
    this.form = this.fb.nonNullable.group({
      id: [''],
      lastUpdated: new FormControl(new Date()),
      start: [new Date()],
      stop: [new Date()],
      project: [''],
      tags: [['']],
    })

    this.form.setValue(this.data.frame);
  }

  
}
