import { Component, ViewChild, ElementRef } from '@angular/core';
import {FileUploadService} from '../services/file-upload.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable} from "rxjs";
// @ts-ignore
import { v4 as uuid } from "uuid";

@Component({
  selector: 'app-dragdrop',
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.scss'],
})
export class DragdropComponent {
  @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef | undefined;
  files: any[] = [];
  message: string[] = [];
  item: any;
  selectedFiles?: FileList;
  fileInfos?: Observable<any>;
  myId: any;
  constructor(private uploadService: FileUploadService) { }

  ngOnInit() {
    this.fileInfos = this.uploadService.getFiles();
    this.myId = uuid();
    console.log("onInit");
    console.log(this.myId);
  }

  /**
   * on file drop handler
   */
  onFileDropped($event: any[]) {
    console.log('File dropped.');

    this.prepareDroppedFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler($event: any) {
    this.selectedFiles = $event.target.files;
    // @ts-ignore
    this.prepareFilesList(this.selectedFiles );
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress >= 100) {
      console.log('Upload in progress.');
      return;
    }
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }


  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareDroppedFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    // @ts-ignore
    this.fileDropEl.nativeElement.value = "";
    //this.uploadFilesSimulator(0);
  }

  readyToUpload(){
    return this.files.length > 0;
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList() {
    console.log('prepareFilesList invoked.');

    if ( this.selectedFiles !== undefined) {
      console.log('dropped file found.');

      // @ts-ignore
      for (let i = 0; i < this.selectedFiles.length; i++) {
        console.log(this.selectedFiles.item(i));
        this.item = this.selectedFiles.item(i);
        this.item.progress = 0;
        this.files.push(this.selectedFiles.item(i));
      }
      // @ts-ignore
      this.fileDropEl.nativeElement.value = '';
      //this.uploadFilesSimulator(0);
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

      this.uploadService.upload(file,this.myId, "","").subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.files[idx].progress = Math.round(100 * event.loaded / event.total);
            // this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          this.files[idx].progress = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
          console.log(err);
          this.fileInfos = this.uploadService.getFiles();
        });
    }
  }


  uploadFiles(): void {
    console.log('uploadFiles invoked.');

    this.message = [];
    console.log(this.files);
    if (this.files) {
      for (let i = 0; i < this.files.length; i++) {
        this.upload(i, this.files[i]);
      }
    }
  }
}
