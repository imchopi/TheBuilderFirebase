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
  @Output() onRegister = new EventEmitter<Build>();

  form: FormGroup;
  mode = false;

  buildName: string | null = null;
  className: string | null = null;
  itemName: string | null = null;

  selectedClasses: Class[] | null = null;
  selectedItems: FullItem[] | null = null;
  buildId: string | null = null;

  showMaxLengthError: boolean = false;

  building: Build[] | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private buildService: BuildService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firebaseSvc: FirebaseService
  ) {
    this.form = this.formBuilder.group({
      buildName: [null, Validators.required],
      className: [null, Validators.required],
      itemName: [null, Validators.required],
    });
  }

  async ngOnInit() {
    const classes = await this.buildService.getClass();
    this.selectedClasses = classes;

    const items = await this.buildService.getItems();
    this.selectedItems = items;

    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      const buildIdParam = paramMap.get('buildId');
      if (buildIdParam) {
        this.mode = true;
        this.buildId = buildIdParam;
        console.log('id del item: ' + this.buildId);

        // Obtener los datos del ítem
        const build = await this.buildService.getBuildById(buildIdParam);

        // Asignar los valores del ítem al formulario
        if (build) {
          // Asignar los valores del ítem al formulario
          this.form.patchValue({
            buildName: build.buildName,
            className: build.class.className,
            itemName: build.fullItem.itemName,
          });
        }
      }
    });
  }

  async onRegisterBuild() {
    if (this.form && this.form.valid) {
      const buildName = this.form.get('buildName')?.value;
      const classSel =  this.selectedClasses?.find(
        (classData) => classData.className === this.form.get('className')?.value
      );
      const itemSel = this.selectedItems?.find(
        (item) => item.itemName === this.form.get('itemName')?.value
      );

      if (classSel && itemSel) {
        const buildData: Build = {
          userUid: this.firebaseSvc.currentUserId(),
          buildName: buildName || '',
          class: {
            className: classSel.className,
            classImage: classSel.classImage,
          },
          fullItem: {
            itemName: itemSel.itemName,
            type: {
              idType: itemSel.type.idType || '',
              typeName: itemSel.type.typeName,
            },
            quality: {
              idQuality: itemSel.quality.idQuality || '',
              qualityName: itemSel.quality.qualityName,
            },
          },
        };

        console.log('Datos de construcción:', buildData);
        this.onRegister.emit(buildData);
        return buildData;
      } else {
        console.log('No se encontró la clase o el ítem seleccionado.');
      }
    } else {
      console.log('El formulario no es válido.');
    }
    return null;
  }

  async updateBuild() {
    if (this.form && this.form.valid && this.buildId !== null) {
      const buildName = this.form.get('buildName')?.value;
      const classSel = this.selectedClasses?.find(
        (classInfo) => classInfo.className === this.form.get('className')?.value
      );
      const itemSel = this.selectedItems?.find(
        (item) => item.itemName === this.form.get('itemName')?.value
      );
      if (classSel && itemSel) {
        const buildData: Build = {
          userUid: this.firebaseSvc.currentUserId(),
          buildName: buildName || '',
          class: classSel,
          fullItem: {
            itemName: itemSel.itemName,
            type: {
              idType: itemSel.type.idType || '',
              typeName: itemSel.type.typeName,
            },
            quality: {
              idQuality: itemSel.quality.idQuality || '',
              qualityName: itemSel.quality.qualityName,
            },
          },
        };
        await this.buildService.updateBuild(this.buildId, buildData);
        this.router.navigate(['/build-info']);
      }
    }
  }

  handleShowMaxLengthErrorChange(showMaxLengthError: boolean) {
    this.showMaxLengthError = showMaxLengthError;
  }
}
