import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { FirebaseService } from 'src/app/core/services/auth-firebase/auth-firebase.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(private auth: FirebaseService, private router: Router) {}

  ngOnInit() {}

  async register(registerInfo: UserRegisterInfo) {
    try {
      const data = await this.auth.register(registerInfo);
      this.router.navigate(['/home']);
    } catch (error) {
      // Manejar el error en caso de que ocurra un problema durante el registro
      console.error('Error al registrarse:', error);
      // Aquí puedes mostrar un mensaje de error al usuario si es necesario
    }
  }

  navigateLogin() {
    this.router.navigate(['/login']);
  }
}
