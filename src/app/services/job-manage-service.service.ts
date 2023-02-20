import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpEvent, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rjob } from '../rjob';

@Injectable({
  providedIn: 'root'
})
export class JobManageServiceService {
  private baseUrl = 'http://localhost:8080';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  registerJob(rjob: Rjob): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    const req = new HttpRequest('POST', `/register`, rjob, {
      reportProgress: false,
      headers: this.headers,
      responseType: 'json'
    });
    const url = `${this.baseUrl}/register`;
    const headers = { 'content-type': 'application/json'}
    const httpOpts = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'responsetype' :'text' })
    };
    // @ts-ignore
    let options = this.httpOptions// @ts-ignore
    return this.http.post(url, rjob, httpOpts);
    // return this.http.request(req);
  }

  getJobList(rjob: Rjob): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    const req = new HttpRequest('POST', `/register`, rjob, {
      reportProgress: false,
      headers: this.headers,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
