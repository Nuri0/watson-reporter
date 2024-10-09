import { Observable } from 'rxjs';
import { Log } from '../parsing/log';
import { Report } from '../parsing/report';


export interface WatsonDataProviderService {

  listProjects(): Observable<Array<string>>;
  getTodaysLog(): Observable<Array<Log>>;
  listTags(): Observable<Array<string>>;
  // getProjectTimes(start: Date, end: Date): Observable<Report>;
  getProjectTimesForCurrentMonth(): Observable<Report>;

}
