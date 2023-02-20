import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { RefRegistrationComponent } from '../ref-registration/ref-registration.component';
import { VcfRegistrationComponent } from '../vcf-registration/vcf-registration.component';
import { SelectreferenceComponent } from '../selectreference/selectreference.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  @ViewChild(RefRegistrationComponent, {static: false}) newRef: RefRegistrationComponent | undefined;
  @ViewChild(SelectreferenceComponent, {static: false}) selectRef: SelectreferenceComponent | undefined;
  @ViewChild(VcfRegistrationComponent, {static: false}) newVcf: VcfRegistrationComponent | undefined;
  name = 'Angular';
  tabIndex = 0 ;
  currentRefId = '';
  currentGenome = '';
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // @ts-ignore
    this.currentRefId = this.newRef.currentRefId;
    // this.msgFromChild1 = this.child1.msgFromChild1;
  }
  changeTab(event: { index: number; }){
    console.log(event.index);
    this.tabIndex = event.index;
    if (event.index === 0){
      // @ts-ignore
      this.currentRefId = this.selectRef.currentRefId;
      // @ts-ignore
      this.currentGenome = this.selectRef.currentGenome;
    }
    else if (event.index === 1){
      // @ts-ignore
      this.currentRefId = this.newRef.currentRefId;
      // @ts-ignore
      this.currentGenome = this.newRef.currentGenome;
    }
    else{
      // @ts-ignore
      this.newVcf.currentRefId =  this.currentRefId;
      // @ts-ignore
      this.newRef.currentGenome = this.currentGenome;
    }
  }
}


