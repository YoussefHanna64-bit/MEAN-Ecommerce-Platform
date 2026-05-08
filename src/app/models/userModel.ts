export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: 'admin' | 'user';
  token: string;
}

export interface UserResponse {
  status: string;
  data?: {
    user: User;
  };
  message?: string;
  code?: number;
}
