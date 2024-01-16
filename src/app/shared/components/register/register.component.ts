import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { PasswordValidation } from 'src/app/validators/password';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() register = new EventEmitter<UserRegisterInfo>();

  form: FormGroup;
  passwordMatchValidator: any;

  @Input('username')
  set username(value: string) {
    this.form.controls['username'].setValue(value);
  }

  @Input('name')
  set name(value: string) {
    this.form.controls['name'].setValue(value);
  }

  @Input('surname')
  set surname(value: string) {
    this.form.controls['surname'].setValue(value);
  }

  @Input('email')
  set email(value: string) {
    this.form.controls['email'].setValue(value);
  }

  constructor(
    private formBuilder: FormBuilder,
    private _modal: ModalController
  ) {
    this.form = this.formBuilder.group(
      {
        id: [null],
        username: ['', [Validators.required]],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        email: ['', [Validators.required]],
        password: [
          '',
          [Validators.required, PasswordValidation.passwordProto()],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: PasswordValidation.passwordMatch(
          'password',
          'confirmPassword'
        ),
      }
    );
  }

  ngOnInit() {}

  onCancel() {
    this._modal.dismiss(null, 'cancel');
  }

  onSubmit() {
    this._modal.dismiss(this.form.value, 'ok');
  }

  onDelete() {
    this._modal.dismiss(this.form.value, 'delete');
  }

  onRegister() {
    this.register.emit(this.form?.value);
    this.form?.reset();
  }
}
