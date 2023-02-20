import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ReferenceData } from './reference';
import { MessageService } from './message.service';
// import {saveAs as importedSaveAs} from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ReferenceDataService {

  private referencesUrl = '/references';  // URL to web api
  private referenceUrl = '/reference';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET references from the server */
  getReferenceDataList(): Observable<ReferenceData[]> {
    return this.http.get<ReferenceData[]>(this.referencesUrl)
      .pipe(
        tap(_ => this.log('fetched references')),
        catchError(this.handleError<ReferenceData[]>('getReferenceData', []))
      );
  }

  // /** GET reference by id. Return `undefined` when id not found */
  // getReferenceDataByUuid<Data>(id: number): Observable<ReferenceData> {
  //   const url = `${this.referencesUrl}/?id=${id}`;
  //   return this.http.get<ReferenceData[]>(url)
  //     .pipe(
  //       map(references => references[0]), // returns a {0|1} element array
  //       tap(h => {
  //         const outcome = h ? `fetched` : `did not find`;
  //         this.log(`${outcome} reference id=${id}`);
  //       }),
  //       catchError(this.handleError<ReferenceData>(`getReferenceData id=${id}`))
  //     );
  // }

  /** GET reference by id. Will 404 if id not found */
  getReferenceDataByUuid(uuid: string): Observable<ReferenceData> {
    const url = `${this.referencesUrl}/getByUuid/${uuid}`;
    return this.http.get<ReferenceData>(url).pipe(
      tap(_ => this.log(`fetched reference uuid=${uuid}`)),
      catchError(this.handleError<ReferenceData>(`getReferenceData id=${uuid}`))
    );
  }

  /** GET reference by id. Will 404 if id not found */
  getReferenceData(id: number): Observable<ReferenceData> {
    const url = `${this.referenceUrl}/${id}`;
    return this.http.get<ReferenceData>(url).pipe(
      tap(_ => this.log(`fetched reference id=${id}`)),
      catchError(this.handleError<ReferenceData>(`getReferenceData id=${id}`))
    );
  }

  /* GET references whose name contains search term */
  searchReferenceData(term: string): Observable<ReferenceData[]> {
    if (!term.trim()) {
      // if not search term, return empty reference array.
      return of([]);
    }
    return this.http.get<ReferenceData[]>(`${this.referencesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found references matching "${term}"`) :
         this.log(`no references matching "${term}"`)),
      catchError(this.handleError<ReferenceData[]>('searchReferenceData', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new reference to the server */
  addReferenceData(reference: ReferenceData | undefined): Observable<ReferenceData> {
    return this.http.post<ReferenceData>(this.referencesUrl+"/register", reference, this.httpOptions).pipe(
      tap((newReferenceData: ReferenceData) => this.log(`added reference w/ genome_assembly_id=${newReferenceData.genome_assembly_id}`)),
      catchError(this.handleError<ReferenceData>('addReferenceData'))
    );
  }

  /** DELETE: delete the reference from the server */
  deleteReferenceData(id: number): Observable<ReferenceData> {
    const url = `${this.referenceUrl}/${id}`;

    return this.http.delete<ReferenceData>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted reference id=${id}`)),
      catchError(this.handleError<ReferenceData>('deleteReferenceData'))
    );
  }

  /** PUT: update the reference on the server */
  updateReferenceData(reference: ReferenceData): Observable<any> {
    return this.http.post(this.referencesUrl+"/register", reference, this.httpOptions).pipe(
      tap(_ => this.log(`updated reference id=${reference.refid}`)),
      catchError(this.handleError<any>('updateReferenceData'))
    );
  }

  getReferenceDataOutputByUuid(reference: ReferenceData): Observable<any> {
    const url = `${this.referenceUrl}/output`;
    const headers = { 'content-type': 'application/json'};
    const httpOpts = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responsetype' :'text' })
    };
    let options = this.httpOptions;
    return this.http.post(url, reference, httpOpts);
    // return this.http.post<String>(url, reference, this.httpOptions).pipe(
    //   tap(_ => this.log(`fetched reference output uuid=${reference.uuid}`)),
    //   catchError(this.handleError<String>(`getReferenceDataOutput id=${reference.uuid}`))
    // );
  }

  doDownload(refid: any, contentType: string, path: string, filename: string) {
    // tslint:disable-next-line:triple-equals
    if (filename == undefined || filename == null || filename == '') {

      return this.http
        .get(path + "/" + refid.toString(), {
          headers: new HttpHeaders().append('Content-Type', contentType),
          responseType: 'blob',
          observe: 'body'
        });
    }
    else{
      return this.http
        .get(path + "/" + refid.toString() + "/" + filename.toString() , {
          headers: new HttpHeaders().append('Content-Type', contentType),
          responseType: 'blob',
          observe: 'body'
        });
    }
  }

  getFile(reference: ReferenceData, filename: string){
    /*
    return this.doDownload(reference.id,'text/csv', this.referenceUrl +"/getFile", filename).subscribe(
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
     */
  }


  /** get the reference result */
  getResult(reference: ReferenceData)  {
    return this.doDownload(reference.refid,'text/csv', this.referenceUrl +"/getResult" ,"").subscribe(
      res => {
        var url = window.URL.createObjectURL(res);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = "RESULT-"+ reference.genome_assembly_id + ".csv";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.')
      });

  }


  /** get the reference Error */
  getError(reference: ReferenceData)  {
    return this.doDownload(reference.refid,'text/plain', this.referenceUrl +"/getError", "").subscribe(
      res => {
        var url = window.URL.createObjectURL(res);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = "ERROR-"+ reference.genome_assembly_id + ".txt";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.');
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

  /** Log a ReferenceDataService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ReferenceDataService: ${message}`);
  }
}
