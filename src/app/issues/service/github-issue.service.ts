import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubIssueService {

  constructor(private http: HttpClient) { }

  getIssues(url: string): Observable<any> {
    if (url) {
      return this.http.get(url, { observe: 'response' })
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
    } else {
      return this.http.get('https://api.github.com/repos/github/docs/issues?per_page=10', { observe: 'response' })
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
    }
  }


  postNewIssue(url: string) {
    
    return this.http.post(url, { observe: 'response' })
    .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
    
  }



  getLabels(url: string): Observable<any> {
    if (url) {
      return this.http.get(url, { observe: 'response' })
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
    } else {
      return this.http.get('https://api.github.com/repos/Jojjeboy/pushIt/labels', { observe: 'response' })
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
    }
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
    return throwError(() => new Error('Something bad happened; please try again later.'))
  }



}


