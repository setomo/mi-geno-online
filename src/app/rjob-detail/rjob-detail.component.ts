import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// @ts-ignore
import { v4 as uuid } from 'uuid';

import { Rjob } from '../rjob';
import { RjobService } from '../rjob.service';
import { isNumeric } from 'rxjs/internal-compatibility';
import { FileUploadService } from '../services/file-upload.service';
import { FileInfo } from '../rjobs/fileInfo';

@Component({
  selector: 'app-rjob-detail',
  templateUrl: './rjob-detail.component.html',
  styleUrls: ['./rjob-detail.component.css'],
})
export class RjobDetailComponent implements OnInit {
  rjob: Rjob | undefined;
  detailData: any;
  genoFile: any;
  phenoFile: any;
  files: FileInfo[] = [];
  currentId: any;
  fileJson: any;

  constructor(
    private route: ActivatedRoute,
    private rjobService: RjobService,
    private location: Location,
    private uploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.getRjob();
  }

  getOutputFiles(rjob: Rjob) {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    this.rjobService.getRjobOutputByUuid(rjob).subscribe(
      (outputFiles: any) => {
        this.fileJson = outputFiles;
        console.log('Getting output files.');
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getRjob(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.currentId = id;
    this.rjobService.getRjob(id).subscribe(
      (rjob: any) => {
        this.updateDetail(rjob);
        if (!isNumeric(rjob.uid)) {
          this.uploadService.getFilesByUuid(rjob.uuid).subscribe(
            (files: any) => {
              this.files = files;
              for (let i = 0; this.files.length > i; i++) {
                if (this.files[i].fileType === 'genotype') {
                  this.genoFile = this.files[i].name;
                } else {
                  this.phenoFile = this.files[i].name;
                }
              }
              console.log('Getting files.');
            },
            (err: any) => {
              console.log(err);
            }
          );
        }
      },
      (err: any) => {
        console.log(err);
      }
    );

    // .subscribe(rjob => this.rjob = rjob );
  }

  updateDetail(rjob: Rjob): void {
    console.log(rjob);
    this.rjob = rjob;
    console.log(this.rjob.jsonData);
    this.detailData = JSON.parse(this.rjob.jsonData);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.rjob) {
      this.rjob.jsonData = JSON.stringify(this.detailData);
      this.rjob.uuid = uuid();
      console.log(JSON.stringify(this.detailData));
      console.log(this.rjob);
      this.rjobService.updateRjob(this.rjob).subscribe(() => this.goBack());
    }
  }

  getResult(): void {
    if (this.rjob) {
      this.rjobService.getResult(this.rjob);
    }
  }

  getError(): void {
    if (this.rjob) {
      this.rjobService.getError(this.rjob);
    }
  }
}
