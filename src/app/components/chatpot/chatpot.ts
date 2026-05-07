import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chatpot',
  imports: [],
  templateUrl: './chatpot.html',
  styleUrl: './chatpot.css',
})
export class Chatpot {
  @Input() onClose: (() => void) | null = null;

  closeChatpot() {
    if (this.onClose) {
      this.onClose();
    }
  }
}
