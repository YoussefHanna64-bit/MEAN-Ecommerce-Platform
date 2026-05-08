import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chatpot } from '../chatpot/chatpot';

import { Products } from '../products/products';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Chatpot, Products],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  isChatOpen: boolean = false;
  chatpotOpen = signal<boolean>(false);

  toggleChatpot() {
    this.chatpotOpen.update((value) => !value);
  }

  onShopCollection() {
    // scroll to products or navigate — up to you
    document.querySelector('.product-card')?.scrollIntoView({ behavior: 'smooth' });
  }
}
