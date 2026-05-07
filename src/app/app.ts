import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./shared/footer/footer";
import { Navbar } from "./shared/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar],
  //templateUrl: './app.html',
  template: `
     <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('stayfinder');
}
