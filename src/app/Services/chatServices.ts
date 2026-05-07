import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Move the interface here so it can be shared
export interface ChatMessage {
  text: string;
  sender: 'bot' | 'user';
  time: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http = inject(HttpClient);
  private backendUrl = 'http://localhost:5000/api/chat';

  // 2. The memory lives here now! It will never be deleted when the chat closes.
  messages: ChatMessage[] = [
    {
      text: "Hello! I'm your E-SHOP concierge. How can I assist you with your premium experience today?",
      sender: 'bot',
      time: new Date(),
    },
  ];

  sendMessageToAI(message: string): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(this.backendUrl, { message });
  }
}
