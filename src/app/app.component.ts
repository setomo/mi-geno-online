import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GS Modeling';
  constructor(private router: Router) {}
  isHomeRoute() {
    return this.router.url === '/' || this.router.url === '/landingpage';
  }
}
