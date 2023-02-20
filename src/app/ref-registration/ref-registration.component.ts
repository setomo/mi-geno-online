import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Rjob } from '../rjob';
import { JobDetail } from '../rjobs/jobDetail';
import { RjobService } from '../rjob.service';
import { FileUploadService } from '../services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
// @ts-ignore
import { v4 as uuid } from 'uuid';
import { isNumeric } from 'rxjs/internal-compatibility/index';
import { ProcessDialogComponent } from '../process-dialog/process-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ref-registration',
  templateUrl: './ref-registration.component.html',
  styleUrls: ['./ref-registration.component.css'],
})
export class RefRegistrationComponent implements OnInit {
  @ViewChild('fileDropRef', { static: false }) fileDropEl:
    | ElementRef
    | undefined;
  currentRefId = { id: '' };
  currentGenome = { name: '' };
  files: any[] = [];
  // tslint:disable-next-line:variable-name
  files_1: any[] = [];
  message: string[] = [];
  item: any;
  genoFile: any = { genoFile: '' };
  selectedFiles?: FileList;
  isSelected: boolean | undefined;
  fileInfos?: Observable<any>;
  myId: any;
  rjobs: Rjob[] = [];
  // rjob: Rjob = {};
  rjob = {} as Rjob;
  job: any;
  jsonData = {} as JobDetail;

  constructor(
    private rjobService: RjobService,
    private uploadService: FileUploadService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // this.getRjobs();
    this.fileInfos = this.uploadService.getFiles();
    this.myId = uuid();
    this.genoFile = {
      trainingGenoType: 'vcf',
    };
    this.jsonData.Kcv = 2;
    this.jsonData.Cyclescv = 20;
    this.jsonData.GBLUP_RR = true;
    this.jsonData.nIter = 15000;
    this.jsonData.burnIn = 5000;
    this.jsonData.ntree = 500;
    this.jsonData.randomSeedNumber = 1;
    this.rjob.uuid = this.myId;
    this.rjob.fileGroupId = this.myId;
    this.rjob.jsonData = JSON.stringify(this.jsonData);
    this.rjob.state = 0;
    const today = new Date();
    this.rjob.createdDate = today.toISOString();
    this.rjob.hostId = '';
    this.rjob.uid = '';
    this.rjob.completedDate = '';
    this.rjob.id = 0;
    this.rjob.errorMessage = '';
    this.rjob.completedDate = '';
    this.rjob.succeeded = false;
    this.rjob.completed = false;
    this.isSelected = false;

    console.log('onInit');
    console.log(this.myId);
  }

  getRjobs(): void {
    this.rjobService
      .getRjobs()
      .subscribe((rjobs) => (this.rjobs = rjobs.slice(1, 5)));
  }

  /**
   * on file drop handler
   */
  onFileDropped($event: any[], idx: number, filetype: string) {
    console.log('File dropped.');
    console.log($event);
    this.prepareDroppedFilesList($event, idx, filetype);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler($event: any, idx: number, filetype: string) {
    console.log($event);
    this.selectedFiles = $event.target.files;
    // @ts-ignore
    this.prepareFilesList(idx, filetype);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   * @param idx (input index)
   */
  deleteFile(index: number, idx: number) {
    if (this.files[index].progress >= 100) {
      console.log('Upload in progress.');
      return;
    }

    switch (idx) {
      case 1: {
        console.log('before delete 1:' + this.files_1.length);
        this.files_1.splice(index, 1);
        console.log('after delete 1:' + this.files_1.length);
        break;
      }
    }
    // if(idx ==1) {
    //   console.log("before delete:"+this.files_1.length);
    //   this.files_1.splice(index, 1);
    //   console.log("after delete:"+this.files_1.length);
    // }
    // else {
    //   console.log("before delete:"+this.files_2.length);
    //   this.files_2.splice(index, 1);
    //   console.log("after delete:"+this.files_2.length);
    // }
    this.files = [];
    if (this.files_1.length > 0) {
      this.files.push(this.files_1);
    }
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   * @param idx  (input index)
   * @param fileType (geno or pheno)
   */
  prepareDroppedFilesList(files: Array<any>, idx: number, fileType: string) {
    for (const item of files) {
      item.progress = 0;
      item.fileType = fileType;
      this.files.push(item);
      switch (idx) {
        case 1: {
          item.trainingGenoType = this.genoFile.trainingGenoType;
          this.files_1.push(item);
          this.isSelected = true;
          break;
        }
      }
    }
  }

  readyToUpload() {
    return this.files_1.length > 0;
  }

  /**
   * Convert Files list to normal array list
   * @param idx (input index)
   * @param fileType (geno/pheno)
   */
  prepareFilesList(idx: number, fileType: string) {
    console.log('prepareFilesList invoked. idx=' + idx);

    if (this.selectedFiles !== undefined) {
      console.log('dropped file found.');

      // @ts-ignore
      for (let i = 0; i < this.selectedFiles.length; i++) {
        console.log(this.selectedFiles.item(i));
        this.item = this.selectedFiles.item(i);
        this.item.progress = 0;
        this.item.fileType = fileType;
        this.item.trainingGenoType = this.genoFile.trainingGenoType;
        this.files.push(this.selectedFiles.item(i));
        this.isSelected = true;
        switch (idx) {
          case 1: {
            this.files_1.push(this.selectedFiles.item(i));
            break;
          }
        }
      }
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  upload(idx: number, file: File): void {
    console.log('Upload invoked.');
    if (file != null) {
      console.log('call uploadService.');
      console.log(this.myId);

      this.uploadService
        .upload(
          file,
          this.myId,
          this.files[idx].fileType,
          this.files[idx].trainingGenoType
        )
        .subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.files[idx].progress = Math.round(
                (100 * event.loaded) / event.total
              );
              // this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              const msg = 'Uploaded the file successfully: ' + file.name;
              this.message.push(msg);
              this.fileInfos = this.uploadService.getFiles();
              // register
              this.registerJob();
            }
          },
          (err: any) => {
            this.files[idx].progress = 0;
            const msg = 'Could not upload the file: ' + file.name;
            this.message.push(msg);
            console.log(err);
            this.fileInfos = this.uploadService.getFiles();
          }
        );
    }
  }

  uploadFiles(): void {
    console.log('uploadFiles invoked.');
    this.myId = uuid();
    this.rjob.uuid = this.myId;
    this.rjob.fileGroupId = this.myId;
    this.message = [];
    console.log(this.files);
    if (this.files) {
      for (let i = 0; i < this.files.length; i++) {
        this.upload(i, this.files[i]);
      }
    }
  }

  registerJob(): void {
    console.log('registerJob invoked.');
    this.message = [];
    console.log(this.jsonData);
    this.rjob.jsonData = JSON.stringify(this.jsonData);
    console.log(JSON.stringify(this.jsonData));
    console.log(this.rjob);
    this.rjobService.getRjobByUuid(this.rjob.uuid).subscribe(
      (job: any) => {
        if (!isNumeric(job.uid)) {
          this.rjobService.addRjob(this.rjob).subscribe(
            (event: any) => {
              let count = 0;
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.files.length; i++) {
                // tslint:disable-next-line:triple-equals
                if (this.files[i].progress == 100) {
                  count++;
                }
              }
              // tslint:disable-next-line:triple-equals
              if (this.files.length == count) {
                this.openProcessDialog();
              }
              console.log('registering job completed');
            },
            (err: any) => {
              const msg = 'Could not add new job ';
              this.openErrorDialog();
              this.message.push(msg);
              console.log(err);
            }
          );
        }
      },
      (err: any) => {
        const msg = 'Skip registering new job';
        this.openErrorDialog();
        this.message.push(msg);
        console.log(err);
      }
    );
  }

  openProcessDialog() {
    const dialogRef = this.dialog.open(ProcessDialogComponent, {
      data: {
        message:
          '新規Jobが登録されました。履歴ボタンを押し、Jobの実行結果の確認を行ってください。',
        cancelButtonText: 'Done',
      },
    });
  }

  openErrorDialog() {
    const dialogRef = this.dialog.open(ProcessDialogComponent, {
      data: {
        message:
          '新規Jobの登録ができませんでした。 ディスクの空き容量を確認し再度登録を行ってください。',
        cancelButtonText: 'Close',
      },
    });
  }
}
