import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { RjobsComponent } from './rjobs/rjobs.component';
import { RjobDetailComponent } from './rjob-detail/rjob-detail.component';
import { RegsteredFilesComponent } from './regstered-files/regstered-files.component';
const routes: Routes = [
  { path: '', redirectTo: 'index.html', pathMatch: 'full' },
  { path: 'landingpage', component: LandingpageComponent },
  { path: 'newregistration', component: DashboardComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'detail/:id', component: RjobDetailComponent },
  { path: 'rjobs', component: RjobsComponent },
  { path: 'registeredfiles', component: RegsteredFilesComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule {

  constructor( private router: Router) {this.router.navigate(['/landingpage']); }


}
