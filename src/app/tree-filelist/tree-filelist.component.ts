import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';
import { FileInfo } from '../rjobs/fileInfo';
import { RjobService } from '../rjob.service';
import { Rjob } from '../rjob';

import { FileNode, DataService } from '../services/data.service';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'tree-filelist',
  templateUrl: 'tree-filelist.component.html',
  styleUrls: ['tree-filelist.component.css'],
})
export class TreeFilelistComponent implements OnInit {
  // @ts-ignore
  @Input('rjob') rjob: Rjob;

  private _transformer = (node: FileNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };
  constructor(
    private dataService: DataService,
    private rjobService: RjobService
  ) {}
  ngOnInit() {
    // // @ts-ignore
    // this.dataService.getData().subscribe(res=>{
    //   this.dataSource.data = res;
    // })
    console.log('NGONINIT---');
    this.rjobService.getRjobOutputByUuid(this.rjob).subscribe(
      (outputFiles) => {
        console.log('file tree--------');
        console.log(outputFiles);
        // @ts-ignore
        this.dataService.getData().subscribe((res) => {
          console.log(res);
          res.pop();
          res.push(outputFiles);
          this.dataSource.data = res;
        });
        // this.dataSource.data = outputFiles;
        console.log('Getting output files. in nginit');
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  download(node: FileNode) {
    console.log('download');
    console.log(this.rjob);
    if (this.rjob) {
      console.log('Download clicked');
      console.log(node.name);
      this.rjobService.getFile(this.rjob, node.name);
    }
  }
}

/**  Copyright 2019 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license */
