import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Rjob } from '../rjob';
import { RjobService } from '../rjob.service';

@Component({
  // selector: 'app-rjob-search',
  templateUrl: './rjob-search.component.html',
  styleUrls: [ './rjob-search.component.css' ]
})
export class RjobSearchComponent implements OnInit {
  rjobs$!: Observable<Rjob[]>;
  private searchTerms = new Subject<string>();

  constructor(private rjobService: RjobService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.rjobs$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.rjobService.searchRjobs(term)),
    );
  }
}
