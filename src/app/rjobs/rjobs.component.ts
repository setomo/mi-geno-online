import { Component, OnInit } from '@angular/core';

import { Rjob } from '../rjob';
import { RjobService } from '../rjob.service';
import {Status} from './status';
import { Observable, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-rjobs',
  templateUrl: './rjobs.component.html',
  styleUrls: ['./rjobs.component.css']
})


export class RjobsComponent implements OnInit {
  rjobs: Rjob[] = [];
  public Status = Status;
  // @ts-ignore
  counter$: Observable<number>;
  count = 0;
  countup = 1;
  sumup = 1;
  constructor(private rjobService: RjobService) { }

  ngOnInit() {
    this.getRjobs();
    this.counter$ = timer(0, 60000).pipe(
      take(90000),
      map(() => this.count++)
    );

    this.counter$.subscribe(
      (c) => {
        // console.log("c="+c);
        // tslint:disable-next-line:triple-equals
        if (c == this.sumup) {
          console.log('in----------');
          console.log('c =' + c);
          this.sumup = this.countup + c;
          if (c <= 60) {
            this.countup = c;
          }
          console.log('countup =' + this.countup);
          console.log('sum =' + this.sumup);
          this.getRjobs();
        }
      },
      () => {},
      () => {
        console.log('finished:', this.count);
      }
    );
  }

  getRjobs(): void {
    this.rjobService.getRjobs()
    .subscribe(rjobs => this.rjobs = rjobs);
  }

  add(job: Rjob): void {
    const uid = job.uid.trim();
    if (!uid) { return; }
    this.rjobService.addRjob(job)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(job => {
        this.rjobs.push(job);
      });
  }

  delete(rjob: Rjob): void {
    this.rjobs = this.rjobs.filter(h => h !== rjob);
    this.rjobService.deleteRjob(rjob.id).subscribe();
  }

}
