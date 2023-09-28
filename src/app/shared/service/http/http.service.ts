import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export interface Gitlog {
  commithash: string;
  date: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  configAndExampleData = 'assets/example.config-data.json';
  exampleData = 'assets/example.data.json';

  constructor(private http: HttpClient) { }

  getExamplesWithConfig(){
    return this.http.get<Object[]>(this.configAndExampleData)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  getExamplesOnly(){
    return this.http.get<Object[]>(this.exampleData)
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }



}
