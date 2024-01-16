import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  register(registerInfo: UserRegisterInfo) {
    this.auth.register(registerInfo).subscribe({
      next: (data) => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
      },
    });
  }

  navigateLogin() {
    this.router.navigate(['/login']);
  }
}
