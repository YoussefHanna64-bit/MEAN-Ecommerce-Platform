import {
  Component,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService, ChatMessage } from '../../Services/chatServices';

@Component({
  selector: 'app-chatpot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatpot.html',
  styleUrl: './chatpot.css',
})
export class Chatpot implements AfterViewChecked {
  @Output() closeChat = new EventEmitter<void>();

  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  chatService = inject(ChatService);

  userInput: string = '';
  isTyping: boolean = false;

  get messages() {
    return this.chatService.messages;
  }

  closeChatpot() {
    this.closeChat.emit();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatScrollContainer.nativeElement.scrollTop =
        this.chatScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage(suggestedText?: string) {
    const textToSend = suggestedText || this.userInput.trim();
    if (!textToSend) return;

    // 5. Update the SERVICE's message array, not a local one
    this.chatService.messages = [
      ...this.chatService.messages,
      { text: textToSend, sender: 'user', time: new Date() },
    ];
    this.userInput = '';
    this.isTyping = true;

    this.chatService.sendMessageToAI(textToSend).subscribe({
      next: (response) => {
        this.chatService.messages = [
          ...this.chatService.messages,
          { text: response.reply, sender: 'bot', time: new Date() },
        ];
        this.isTyping = false;
      },
      error: (err) => {
        this.chatService.messages = [
          ...this.chatService.messages,
          { text: 'Connection error. Please try again.', sender: 'bot', time: new Date() },
        ];
        this.isTyping = false;
      },
    });
  }
}
