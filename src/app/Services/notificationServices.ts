import { Injectable, signal } from "@angular/core";
import { NotificationMessage, NotificationType } from "../Types/NotificationDatatype";
@Injectable({ providedIn: 'root' })
export class NotificationService {
  message = signal<NotificationMessage>({ message: '', type: 'None' });

  show(msg: string, type: NotificationType) {
    this.message.set({ message: msg, type: type });

    setTimeout(() => {
      this.message.set({ message: '', type: 'None' });
    }, 3000);
  }
}