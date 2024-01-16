import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCredentials } from 'src/app/core/interfaces/user-credentials';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  @Input('email') set email(value: string) {}
  @Output() login = new EventEmitter<UserCredentials>();

  form: FormGroup | null = null;

  constructor(private formBuilder: FormBuilder, private _router: Router) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  onLogin() {
    this.login.emit(this.form?.value);
  }
  
  navigateRegister() {
    this._router.navigate(['/signup']);
  }
}
