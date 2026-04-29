import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../Services/notificationServices';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './Notification.html',
  styles: '',
})
export class NotificationComponent {
  notification=inject(NotificationService)  
}
