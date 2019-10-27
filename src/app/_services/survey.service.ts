import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from './message.service';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {environment} from "../../environments/environment";


const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
/**
 * Service class
 * @author Peter Charles Sims
 */
export class SurveyService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
//
  /**
   * Returns tab view and the questions from the tab view
   * @param ID
   * GET request to druapl using the entityId associated with the tab view
   */
  getTabView(ID: number): Observable<string> {
      const url = `${environment.formServerURL}${ID}/${'?_format=json'}`;
      return this.http.get<string>(url)
          .pipe(
              tap(_ => this.log('fetched tabViews')),
              catchError(this.handleError<string>('getTabViewList', ))
          );
  }

    submitSurvey(payload: string): Observable<any> {
        console.log(payload);
        const url = `${environment.submitSurveyURL}`;
        return this.http
            .post<string>(url, payload, httpOptions)
            .pipe(
                tap(_ => this.log(`Deployed Survey`)),
                catchError(this.handleError<any>('addSurvey', payload))
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
