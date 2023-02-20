import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Reference} from '../reference';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap
} from 'rxjs/operators';

export interface FileNode {
  name: string;
  children?: FileNode[];
}
const TREE_DATA: FileNode[] = [
  {
    name: 'test',
    children: [
    ]
  },
];

@Injectable({
  providedIn: 'root',
})

export class DataService {
  apiRoot = 'https://itunes.apple.com/search';
  listRefs = [];
  constructor(private httpClient: HttpClient) { }
  getData()
  {
    // you generally has some like
    // return this.httpClient.get(...your-url..)
    return of(TREE_DATA);
  }
  getReference() {
    return this.httpClient.get<Reference[]>('https://plantgarden.jp/api/1/getGenomeIdList').subscribe(data => {
        // tslint:disable-next-line:forin
        for (const prop in data){
          // @ts-ignore
          this.listRefs.push(data[prop]);
        }
        console.log(data);
        return this.listRefs;
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      });
  }
  search(term: string){
    return this.getReference();
  }
}
