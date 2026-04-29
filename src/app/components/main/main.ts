import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { SideBar } from '../side-bar/side-bar';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Header,Footer, SideBar],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
