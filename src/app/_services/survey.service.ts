import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from './message.service';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';


const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})

export class SurveyService {
  //
  // private surveysURL = 'http://qadrupal.lan.sesahs.nsw.gov.au/tabview/edit';
  // private drupalURL = 'http://qadrupal.lan.sesahs.nsw.gov.au/rest/tab/list?_format=json';
 // private tabViewURL = 'http://qadrupal.lan.sesahs.nsw.gov.au/rest/content/tab/get/';

  private tabViewURL = 'http://192.168.1.138:81/';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /**
   * Returns tab view and the questions from the tab view
   * @param ID
   * GET request to druapl using the entityId associated with the tab view
   */
  getTabView(ID: number): Observable<string> {
    const url = `${this.tabViewURL}${ID}${'?_format=json'}`;
    return this.http.get<string>(url)
      .pipe(
        tap(_ => this.log('fetched survey')),
        catchError(this.handleError<string>('getTabViewList', ))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /** Log a SurveyService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`SurveyService: ${message}`);
  }
}
