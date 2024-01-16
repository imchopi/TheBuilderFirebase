import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCredentials } from 'src/app/core/interfaces/user-credentials';
import { AuthService } from '../../core/services/auth/auth.service';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private redirectUrl:string = ""
  constructor(private auth: AuthService, private router: Router, private route:ActivatedRoute) {}
  ngOnInit() {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl')??"/home";
  }

  login(credentials: UserCredentials) {
    this.auth.login(credentials).subscribe({
      next: (data) => {
        this.router.navigate(['/home'])
      },
    });
  }
}
