import { Component, OnInit } from '@angular/core';
import {Reference} from '../reference';
// @ts-ignore
import FuzzySearch from 'fuzzy-search';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {take} from "rxjs/operators";

@Component({
  selector: 'app-regstered-files',
  templateUrl: './regstered-files.component.html',
  styleUrls: ['./regstered-files.component.css']
})
export class RegsteredFilesComponent  implements OnInit {
  selection: number | undefined;
  public searchText: string | undefined;
  public result: [] | undefined;
  listRefs = [];
  isSelected = false;
  subject: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
  reference$: Observable<any> =  this.subject.asObservable();
  constructor( private httpClient: HttpClient) {
  }
  ngOnInit() {
    // this.dataService.getReference();
    this.getReference();
  }
  openTable(){
  }
  addElementToObservableArray(item: any) {
    this.reference$.pipe(take(1)).subscribe(val => {
      console.log(val);
      const newArr = [...val, item];
      this.subject.next(newArr);
    });
  }
  getReference() {
    // this.reference$ = new Observable<Reference[]>();
    return this.httpClient.get<any[]>('https://plantgarden.jp/api/1/getGenomeIdList').subscribe(data => {
        let cnt = 0;
        // tslint:disable-next-line:forin
        for (const prop in data) {
          // @ts-ignore
          let ref = data[prop].species_name.replaceAll(' ', '_') + '_' + data[prop].genome_assembly_id;
          // @ts-ignore
          data[prop].refName = ref;
          // @ts-ignore
          this.listRefs.push(data[prop]);
          // ref.refName = this.listRefs[0].species_name.replaceAll(' ', '_') + '_' + this.listRefs[0].genome_assembly_id;
          console.log(this.listRefs[cnt]);
          // @ts-ignore
          // this.reference$.push(data[prop]);
          //   this.reference$.pipe(take(1)).subscribe(val => {
          //     console.log(val);
          //     const newArr = [...val, data[prop]];
          //     this.subject.next(newArr);
          //   });
          // }
          this.addElementToObservableArray(this.listRefs[cnt]);
          cnt++;
        }
        // this.reference$ = this.listRefs;
        // console.log(this.reference$);
        // @ts-ignore
        this.result = this.listRefs;
        return this.reference$;
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      });
  }
  selectReference(str: Reference) {
    this.isSelected = true;
    console.log('Selected Ref object: ', str);
  }
  searcher = new FuzzySearch(this.listRefs, ['species_id', 'species_name', 'sub_name'], {
    caseSensitive: false
  });

  onSearchText() {
    this.result = this.searcher.search(this.searchText);
    console.log(this.searchText, ': ', this.result);
  }


}
