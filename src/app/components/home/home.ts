import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/productModel';
import { ProductService } from '../../Services/productServices';
import { CartService } from '../../Services/cartService';
import { NotificationService } from '../../Services/notificationServices';
import { Chatpot } from '../chatpot/chatpot';
import { HeroSectionComponent } from '../hero-section/hero-section';
import { Products } from "../products/products";

@Component({
  selector: 'app-home',
  imports: [CommonModule, Chatpot, HeroSectionComponent, Products],
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
