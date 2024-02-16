import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCredentials } from 'src/app/core/interfaces/user-credentials';
import { AuthService } from '../../core/services/auth.service';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { FirebaseService } from 'src/app/core/services/auth-firebase/auth-firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private redirectUrl:string = ""
  constructor(private auth: FirebaseService, private router: Router, private route:ActivatedRoute, private authSvc: AuthService) {}
  ngOnInit() {

  }

  async login(credentials: UserCredentials) {
    try {
      const data = await this.auth.login(credentials);
      this.router.navigate(['/home']);
    } catch (error) {
      // Manejar el error en caso de que ocurra un problema durante el inicio de sesión
      console.error('Error al iniciar sesión:', error);
      // Aquí puedes mostrar un mensaje de error al usuario si es necesario
    }
  }
}
