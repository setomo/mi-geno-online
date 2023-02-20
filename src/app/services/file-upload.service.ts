import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  upload(file: File, id: any, fileType: any, trainingGenoType: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('uuid', id);
    formData.append('fileType', fileType);
    formData.append('trainingGenoType', trainingGenoType)

    const req = new HttpRequest('POST', `/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`/files`);
  }

  getFilesByUuid(uuid:any): Observable<any> {
    return this.http.get(`/files/getByUuid/`+ uuid);
  }
}
