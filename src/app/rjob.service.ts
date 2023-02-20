import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Rjob } from './rjob';
import { MessageService } from './message.service';
// import {saveAs as importedSaveAs} from 'file-saver';

@Injectable({ providedIn: 'root' })
export class RjobService {

  private rjobsUrl = '/rjobs';  // URL to web api
  private rjobUrl = '/rjob';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET rjobs from the server */
  getRjobs(): Observable<Rjob[]> {
    return this.http.get<Rjob[]>(this.rjobsUrl)
      .pipe(
        tap(_ => this.log('fetched rjobs')),
        catchError(this.handleError<Rjob[]>('getRjobs', []))
      );
  }

  // /** GET rjob by id. Return `undefined` when id not found */
  // getRjobByUuid<Data>(id: number): Observable<Rjob> {
  //   const url = `${this.rjobsUrl}/?id=${id}`;
  //   return this.http.get<Rjob[]>(url)
  //     .pipe(
  //       map(rjobs => rjobs[0]), // returns a {0|1} element array
  //       tap(h => {
  //         const outcome = h ? `fetched` : `did not find`;
  //         this.log(`${outcome} rjob id=${id}`);
  //       }),
  //       catchError(this.handleError<Rjob>(`getRjob id=${id}`))
  //     );
  // }

  /** GET rjob by id. Will 404 if id not found */
  getRjobByUuid(uuid: string): Observable<Rjob> {
    const url = `${this.rjobsUrl}/getByUuid/${uuid}`;
    return this.http.get<Rjob>(url).pipe(
      tap(_ => this.log(`fetched rjob uuid=${uuid}`)),
      catchError(this.handleError<Rjob>(`getRjob id=${uuid}`))
    );
  }

  /** GET rjob by id. Will 404 if id not found */
  getRjob(id: number): Observable<Rjob> {
    const url = `${this.rjobUrl}/${id}`;
    return this.http.get<Rjob>(url).pipe(
      tap(_ => this.log(`fetched rjob id=${id}`)),
      catchError(this.handleError<Rjob>(`getRjob id=${id}`))
    );
  }

  /* GET rjobs whose name contains search term */
  searchRjobs(term: string): Observable<Rjob[]> {
    if (!term.trim()) {
      // if not search term, return empty rjob array.
      return of([]);
    }
    return this.http.get<Rjob[]>(`${this.rjobsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found rjobs matching "${term}"`) :
         this.log(`no rjobs matching "${term}"`)),
      catchError(this.handleError<Rjob[]>('searchRjobs', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new rjob to the server */
  addRjob(rjob: Rjob): Observable<Rjob> {
    return this.http.post<Rjob>(this.rjobsUrl+"/register", rjob, this.httpOptions).pipe(
      tap((newRjob: Rjob) => this.log(`added rjob w/ uid=${newRjob.uid}`)),
      catchError(this.handleError<Rjob>('addRjob'))
    );
  }

  /** DELETE: delete the rjob from the server */
  deleteRjob(id: number): Observable<Rjob> {
    const url = `${this.rjobUrl}/${id}`;

    return this.http.delete<Rjob>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted rjob id=${id}`)),
      catchError(this.handleError<Rjob>('deleteRjob'))
    );
  }

  /** PUT: update the rjob on the server */
  updateRjob(rjob: Rjob): Observable<any> {
    return this.http.post(this.rjobsUrl+"/register", rjob, this.httpOptions).pipe(
      tap(_ => this.log(`updated rjob id=${rjob.id}`)),
      catchError(this.handleError<any>('updateRjob'))
    );
  }

  getRjobOutputByUuid(rjob: Rjob): Observable<any> {
    const url = `${this.rjobUrl}/output`;
    const headers = { 'content-type': 'application/json'}
    const httpOpts = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responsetype' :'text' })
    };
    let options = this.httpOptions;
    return this.http.post(url, rjob, httpOpts);
    // return this.http.post<String>(url, rjob, this.httpOptions).pipe(
    //   tap(_ => this.log(`fetched rjob output uuid=${rjob.uuid}`)),
    //   catchError(this.handleError<String>(`getRjobOutput id=${rjob.uuid}`))
    // );
  }

  doDownload(id: number, contentType: string, path: string, filename: string) {
    if (filename == undefined || filename == null || filename == "") {

      return this.http
        .get(path + "/" + id.toString(), {
          headers: new HttpHeaders().append('Content-Type', contentType),
          responseType: 'blob',
          observe: 'body'
        })
    }
    else{
      return this.http
        .get(path + "/" + id.toString() + "/" + filename.toString() , {
          headers: new HttpHeaders().append('Content-Type', contentType),
          responseType: 'blob',
          observe: 'body'
        })
    }
  }

  getFile(rjob: Rjob, filename: string){

    return this.doDownload(rjob.id,'text/csv', this.rjobUrl +"/getFile", filename).subscribe(
      res => {
        var url = window.URL.createObjectURL(res);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.')
      });
  }

  /** get the rjob result */
  getResult(rjob: Rjob)  {

    return this.doDownload(rjob.id,'text/csv', this.rjobUrl +"/getResult" ,"").subscribe(
      res => {
        var url = window.URL.createObjectURL(res);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = "RESULT-"+ rjob.uuid + ".csv";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.')
      });

  }


  /** get the rjob Error */
  getError(rjob: Rjob)  {

    return this.doDownload(rjob.id,'text/plain', this.rjobUrl +"/getError", "").subscribe(
      res => {
        var url = window.URL.createObjectURL(res);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = "ERROR-"+ rjob.uuid + ".txt";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.')
      });

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

  /** Log a RjobService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`RjobService: ${message}`);
  }
}
