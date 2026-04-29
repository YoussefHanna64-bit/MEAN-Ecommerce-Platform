export type NotificationType = 'Success' | 'Delete' | 'Warning'|'Update' | 'None' 
export interface NotificationMessage {
  message: string;
  type: NotificationType;
}