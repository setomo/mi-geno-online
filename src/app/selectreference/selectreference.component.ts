import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Reference, ReferenceData} from '../reference';
import {DataService} from '../services/data.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {take} from "rxjs/operators";
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";
import {FormControl} from '@angular/forms';
import {TooltipPosition} from '@angular/material/tooltip';
import { ReferenceDataService } from '../reference.service';
import {RjobService} from "../rjob.service";
@Component({
  selector: 'app-selectreference',
  templateUrl: './selectreference.component.html',
  styleUrls: ['./selectreference.component.css']
})
export class SelectreferenceComponent implements OnInit {

  subject: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);
  reference$: Observable<any> =  this.subject.asObservable();
  // reference$: Observable<any[]> | undefined;
  public message = 'Uninitialized';
  public response: unknown;
  selectedRefId = '5a15b13c36e7a7f00cf0d7cb';
  selectedGenomeInfo: Reference | undefined;
  referenceData: ReferenceData | undefined;
  listRefs = [];
  disabled = true;
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  constructor(private dataService: DataService, private httpClient: HttpClient,
              private referenceDataService: ReferenceDataService,
  ) {
  }

  ngOnInit() {
    // this.dataService.getReference();
    this.getReference();
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
  onChange(e: Reference) {
    if (e) {
      this.disabled = false;
      console.log(e);
      // @ts-ignore
      // this.referenceData.refName = e.refName;
      // // @ts-ignore
      // this.referenceData.refCode = e.refCode;
      // // @ts-ignore
      // this.referenceData.refid = e.refid;
      // @ts-ignore
      this.referenceData.assembly_version = e.assembly_version;
      // @ts-ignore
      this.referenceData.genome_assembly_id = e.genome_assembly_id;
      // @ts-ignore
      this.referenceData.biological_sample_name = e.biological_sample_name;
      // @ts-ignore
      this.referenceData.english_name = e.english_name;
      // @ts-ignore
      this.referenceData.genome_file_path = e.genome_file_path.genome;

      // @ts-ignore
      this.referenceData.japanese_name = e.japanese_name;
      // @ts-ignore
      this.referenceData.species_id = e.species_id;
      // @ts-ignore
      this.referenceData.species_name = e.species_name;
      // @ts-ignore
      this.referenceData.sub_name = e.sub_name;
      // @ts-ignore
      this.referenceData.sub_rank = e.sub_rank;
    }
    else{
      this.disabled = true;
    }
  }

  downloadRefFile(){
    this.message = 'Registering Reference file..';
    this.response = '';
    this.referenceDataService.addReferenceData(this.referenceData).subscribe((outputFiles: any) => {
        console.log('Getting output files.');
        this.message = 'Reference file registered';

      },
      (err: any) => {
        console.log(err);
      });
  }
}
