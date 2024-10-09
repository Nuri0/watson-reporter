import { Injectable } from '@angular/core';
import { Command } from '@tauri-apps/plugin-shell';
import { from, map, Observable } from 'rxjs';
import { convertToLogs, Log } from '../parsing/log';
import { convertToReport, Report } from '../parsing/report';
import { WatsonDataProviderService } from './watson-data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WatsonCliService implements WatsonDataProviderService {

  private readonly WATSON_CLI_SCOPE_NAME = 'watson';

  constructor() { }

  public listProjects(): Observable<Array<string>> {
    const command = Command.create(this.WATSON_CLI_SCOPE_NAME, "projects");
    return from(command.execute()).pipe(
      map(result => result.stdout.split('\n').filter(p => p !== ''))
    )
  }

  public getTodaysLog(): Observable<Array<Log>> {
    
    const command = Command.create(this.WATSON_CLI_SCOPE_NAME, ["log", "-d", "-c", "-j"]);
    return from(command.execute()).pipe(
      map(result => convertToLogs(result.stdout))
    )
  }

  public listTags(): Observable<Array<string>> {
      const command = Command.create(this.WATSON_CLI_SCOPE_NAME, ['tags']);
      return from(command.execute()).pipe(
        map(result => result.stdout.split('\n').filter( t => t !== '')),
      )
  }

  // getProjectTimes(start: Date, end: Date): Observable<Report> {
  //   const command = new Command(this.WATSON_CLI_SCOPE_NAME, ['report'])
  //   return from(command.execute()).pipe(
  //     map(result => convertToReport(result.stdout))
  //   )
  // }

  getProjectTimesForCurrentMonth(): Observable<Report> {
    const command = Command.create(this.WATSON_CLI_SCOPE_NAME, ['report', '-m' , '-c', '-j'])
    return from(command.execute()).pipe(
      map(result => convertToReport(result.stdout))
    )
  }
}
