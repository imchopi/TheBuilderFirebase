import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  Build,
  BuildPayload,
  Class,
  FullItem,
} from 'src/app/core/interfaces/build';
import { BuildService } from 'src/app/core/services/build-info/build.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirebaseService } from 'src/app/core/services/auth-firebase/auth-firebase.service';

@Component({
  selector: 'app-build-form-add',
  templateUrl: './build-form-add.component.html',
  styleUrls: ['./build-form-add.component.scss'],
})
export class BuildFormAddComponent /*implements OnInit*/ {
  @Input() builds: Build | null = null;
  @Output() onCardClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() onRegister = new EventEmitter<BuildPayload>();

  form: FormGroup;
  mode = false;
  buildName: string | null = null;
  className: string | null = null;
  itemName: string | null = null;
  selectedClasses: Class[] | null = null;
  selectedItems: FullItem[] | null = null;
  buildId: string | null = null;
  user: UserInfo | undefined = undefined;
  showMaxLengthError: boolean = false;

  building: Build[] | null = null

  constructor(
    private formBuilder: FormBuilder,
    private buildService: BuildService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      buildName: [null, Validators.required],
      className: [null, Validators.required],
      itemName: [null, Validators.required]
    })
  }

  async ngOnInit() {
    const classes = await this.buildService.getClass()
    this.selectedClasses = classes;

    const items = await this.buildService.getItems();
    this.selectedItems = items;
  }

  async onRegisterBuild() {
    if (this.form && this.form.valid) {
      const buildData: BuildPayload = {
        buildName: this.form.get('buildName')?.value,
        class: this.form.get('className')?.value,
        fullItem: this.form.get('itemName')?.value
      };
      console.log(buildData);
      this.buildService.addBuild(buildData)
    }
  }

  async updateBuild() {
    if (this.form && this.form.valid && this.buildId !== null) {
      const buildData: Partial<Build> = {
        buildName: this.form.get('buildname')?.value,
        class: this.form.get('selectedClasses')?.value,
        fullItem: this.form.get('selectedItems')?.value,
        // Asumiendo que user es una propiedad de tu componente que contiene la información del usuario actual
        userUid: this.user?.uid,
      };
      
      try {
        await this.buildService.updateBuild(this.buildId, buildData);
        this.router.navigate(['/build-info']);
      } catch (error) {
        console.error('Error al actualizar el build:', error);
        // Manejar el error si es necesario
      }
    }
  }

  handleShowMaxLengthErrorChange(showMaxLengthError: boolean) {
    this.showMaxLengthError = showMaxLengthError;
  }
}
