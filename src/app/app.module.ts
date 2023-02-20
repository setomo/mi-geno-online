import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GSMaterialModule } from './tree-filelist/material-module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RjobDetailComponent } from './rjob-detail/rjob-detail.component';
import { RjobsComponent } from './rjobs/rjobs.component';
import { RjobSearchComponent } from './rjob-search/rjob-search.component';
import { MessagesComponent } from './messages/messages.component';
import { DragdropComponent } from './dragdrop/dragdrop.component';
import { ProgressComponent } from './progress/progress.component';
import { DndDirective } from './direcitves/dnd.directive';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
// import {HttpClientModule} from '@angular/common/http';
// import {NgModule} from '@angular/core';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
// import {BrowserModule} from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// @ts-ignore
import { MatTreeModule } from '@angular/material/tree';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list' ;
import { MatRadioModule } from '@angular/material/radio';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TreeFilelistComponent } from './tree-filelist/tree-filelist.component';
import { MatIconModule } from '@angular/material/icon';
import { ProcessDialogComponent } from './process-dialog/process-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { RegistrationComponent } from './registration/registration.component';
import { SelectreferenceComponent } from './selectreference/selectreference.component';
import { MaterialDesignFrameworkModule } from '@ajsf/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RefRegistrationComponent } from './ref-registration/ref-registration.component';
import { VcfRegistrationComponent } from './vcf-registration/vcf-registration.component';
import { RegsteredFilesComponent } from './regstered-files/regstered-files.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    GSMaterialModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    MatTreeModule,
    MatRadioModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialDesignFrameworkModule,
    NgSelectModule,
    NgOptionHighlightModule,
    AutoCompleteModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    RjobsComponent,
    RjobDetailComponent,
    MessagesComponent,
    RjobSearchComponent,
    DragdropComponent,
    DndDirective,
    UploadFilesComponent,
    TreeFilelistComponent,
    ProgressComponent,
    ProcessDialogComponent,
    LandingpageComponent,
    RegistrationComponent,
    SelectreferenceComponent,
    RefRegistrationComponent,
    VcfRegistrationComponent,
    RegsteredFilesComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
