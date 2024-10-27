import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, EMPTY, filter, map, Observable, switchMap, take, tap, zip } from 'rxjs';
import { FrameDialogComponent, FrameDialogInput } from '../components/frame-dialog/frame-dialog.component';
import { Frame, FrameFile } from '../parsing/frames';
import { Report } from '../parsing/report';
import { WatsonDataProviderService } from './watson-data-provider.service';

@Injectable({
  providedIn: 'root',
})
export class WatsonStoreService implements WatsonDataProviderService {
  private dialogService = inject(MatDialog);

  private readonly LOCAL_STORAGE_KEY = 'frames';

  private frameSubject: BehaviorSubject<FrameFile> = new BehaviorSubject<FrameFile>([]);

  constructor() {
    if (localStorage.getItem(this.LOCAL_STORAGE_KEY) !== null) {
      // TODO check data type for frame-schema
      const frames: FrameFile = JSON.parse(
        localStorage.getItem(this.LOCAL_STORAGE_KEY) ?? ''
      );
      frames.forEach((frame) => {
        frame.start = new Date(frame.start);
        frame.stop = new Date(frame.stop);
      });
      this.frameSubject.next(frames);
    }
  }

  public setFrames(file: FrameFile): void {
    this.frameSubject.next(file);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(file));
  }

  public removeFrames() {
    this.frameSubject.next([]);
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }

  private onlyUnique = (value: any, index: number, array: Array<any>) => {
    return array.indexOf(value) === index;
  };

  private getStartOfToday(): Date {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    return today;
  }

  private getStartOfTomorrow(): Date {
    const startOfToday = this.getStartOfToday();

    startOfToday.setDate(startOfToday.getDate() + 1);

    return startOfToday;
  }

  getTodaysLog(): Observable<Array<Frame>> {
    const startOfToday = this.getStartOfToday();
    const startOfTomorrow = this.getStartOfTomorrow();
    return this.frameSubject.pipe(
      map((frames) => {
        return frames.filter(
          (f) =>
            f.start.getTime() > startOfToday.getTime() &&
            f.start.getTime() < startOfTomorrow.getTime()
        );
      }),
    );
  }

  listProjects(): Observable<Array<string>> {
    return this.frameSubject.pipe(
      map((frames) =>
        frames.map((frame) => frame.project).filter(this.onlyUnique)
      )
    );
  }

  listTags(): Observable<Array<string>> {
    return this.frameSubject.pipe(
      map(frames => this.getTagListFromFrames(frames))
    );
  }

  getProjectTimesForCurrentMonth(): Observable<Report> {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    return this.frameSubject.pipe(
      filter(frames => !!frames),
      map(frames => this.filterFramesByStartEnd(frames, firstDay, lastDay)),
      map(frames => this.mapFramesToReport(frames, firstDay, lastDay)),
    )
  }

  private filterFramesByStartEnd(frames: FrameFile, start: Date, end: Date): FrameFile {
    return frames.filter(f => {
      return f.start.getTime() > start.getTime()
        && f.stop.getTime() < end.getTime()
    });
  }

  private mapFramesToReport(frames: Array<Frame>, from: Date, to: Date): Report {
    // TODO groupBy is relatively new (july 2024) and is not supported for older browsers
    // see tsconfig for current ecma-version
    const groupedByProject = Object.groupBy(frames, (f: Frame) => f.project);
    return {
      projects: Object.keys(groupedByProject).map(p => {
        const frames = groupedByProject[p] ?? [];
        const tagNames = this.getTagListFromFrames(frames);
        return {
          name: p,
          tags: tagNames.map(tag => {
            return {
              name: tag,
              time: this.getSummedDurationForTagInFrames(frames, tag)
            }
          }),
          time: this.getDurationForFrames(frames)
        }
      }),
      time: 0,
      timespan: {
        from,
        to
      }
    }
  }

  private getFrameDurationInSeconds(frame: Frame): number {
    return (frame.stop.getTime() - frame.start.getTime()) / 1000;
  }

  private getTagListFromFrames(frames: Array<Frame>): Array<string> {
    return frames.map(f => f.tags).flat().filter(this.onlyUnique)
  }

  private getDurationForFrames(frames: Array<Frame>): number {
    return frames.reduce((acc, cur) => acc + this.getFrameDurationInSeconds(cur), 0)
  }

  private getSummedDurationForTagInFrames(frames: Array<Frame>, tag: string): number {
    const filteredByTag = frames.filter(f => f.tags.includes(tag));
    return this.getDurationForFrames(filteredByTag);
  }

  private getFrameById(id: string): Frame | undefined {
    return this.frameSubject.value.find(f => f.id === id);
  }

  editLog(id: string): Observable<void> {
    const frame = this.getFrameById(id);

    if (!frame) {
      // TODO show error message
      return EMPTY;
    }

    
    return zip(this.listProjects(), this.listTags()).pipe(
      take(1),
      switchMap(([projects, tags]) => {
        const dialogRef = this.dialogService.open<FrameDialogComponent, FrameDialogInput, Frame>(FrameDialogComponent, {
          data: {
            frame,
            projects: projects.sort(),
            tags: tags.sort()
          },
          width: '800px'
        });

        return dialogRef.afterClosed().pipe(
          filter(Boolean),
          tap(result => this.replaceFrame(result)),
          map(() => {return})
        );
      })
    )

    
  }

  private replaceFrame(frame: Frame): void {
    const frames = this.frameSubject.value;
    const newFrames = frames.map(f => {
      return f.id === frame.id ? frame: f;
    })
    this.frameSubject.next([...newFrames]);
  }
}
