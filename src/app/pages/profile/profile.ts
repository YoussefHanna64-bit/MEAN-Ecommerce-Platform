import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../Services/notificationServices';
import { UserService } from '../../Services/userService';

function matchPassword(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }
  return password.value === confirmPassword.value ? null : { missMatch: true };
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  userService = inject(UserService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  loading = signal(false);

  profileForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.minLength(8)]),
      confirmPassword: new FormControl(''),
    },
    { validators: matchPassword },
  );

  ngOnInit() {
    const currentUser = this.userService.user();

    if (!currentUser?._id) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileForm.patchValue({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      phoneNumber: currentUser.phoneNumber,
      email: currentUser.email,
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const currentUser = this.userService.user();

    if (!currentUser?._id) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading.set(true);

    const updatedData: any = {
      firstName: this.profileForm.get('firstName')!.value!,
      lastName: this.profileForm.get('lastName')!.value!,
      phoneNumber: this.profileForm.get('phoneNumber')!.value!,
      email: this.profileForm.get('email')!.value!.toLowerCase(),
    };

    const password = this.profileForm.get('password')!.value;
    if (password) {
      updatedData.password = password;
    }

    this.userService.updateProfile(currentUser._id, updatedData).subscribe({
      next: (res) => {
        if (res.data?.user) {
          currentUser.firstName = res.data.user.firstName;
          currentUser.lastName = res.data.user.lastName;
          currentUser.phoneNumber = res.data.user.phoneNumber;
          currentUser.email = res.data.user.email;

          this.userService.setCurrentUser(currentUser);
        }

        this.loading.set(false);
        this.notificationService.show('Profile updated successfully.', 'Success');
      },
      error: (e) => {
        this.loading.set(false);
        this.notificationService.show(
          e.error?.message || 'Failed to update profile. Please try again.',
          'Warning',
        );
      },
    });
  }
}
