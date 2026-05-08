import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
