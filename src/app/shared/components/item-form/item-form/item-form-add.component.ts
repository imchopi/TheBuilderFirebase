import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { collection, doc } from 'firebase/firestore';
import { FullItem, Quality, TestItem, Type } from 'src/app/core/interfaces/build';
import { FirebaseService } from 'src/app/core/services/auth-firebase/auth-firebase.service';
import { BuildService } from 'src/app/core/services/build-info/build.service';

@Component({
  selector: 'app-item-form-add',
  templateUrl: './item-form-add.component.html',
  styleUrls: ['./item-form-add.component.scss'],
})
export class ItemFormAddComponent /*implements OnInit*/ {
  @Input() items: FullItem | null = null;
  @Output() onRegister = new EventEmitter<FullItem>();

  form: FormGroup;
  mode = false;
  
  itemName: string | null = null;
  typeName: string | null = null;
  qualityName: string | null = null;

  selectedQualities: Quality[] | null = null;
  selectedTypes: Type[] | null = null;
  itemId: string | null = null;
  showMaxLengthError: boolean = false;

  constructor(
    private firebaseSvc: FirebaseService,
    private formBuilder: FormBuilder,
    private buildService: BuildService,
    private _modal: ModalController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      itemName: ['', Validators.required],
      typeName: ['', Validators.required],
      qualityName: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.selectedQualities = await this.buildService.getQualities();
    this.selectedTypes = await this.buildService.getTypes();
    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
        const itemIdParam = paramMap.get('itemId');
        if (itemIdParam) {
            this.mode = true;
            this.itemId = itemIdParam;
            console.log("id del item: " + this.itemId);
            
            // Obtener los datos del ítem
            const item = await this.buildService.getItemById(itemIdParam);

            // Asignar los valores del ítem al formulario
            this.form.patchValue({
                itemName: item?.itemName,
                qualityName: item?.quality.qualityName,
                typeName: item?.type.typeName
            });
        }
    });
}


  async onRegisterItem() {
    if (this.form && this.form.valid) {
      const itemName = this.form.get('itemName')?.value;
      const selectedQuality = this.selectedQualities?.find(quality => quality.qualityName === this.form.get('qualityName')?.value);
      const selectedType = this.selectedTypes?.find(type => type.typeName === this.form.get('typeName')?.value);
  
      if (selectedQuality && selectedType) {
        const itemData: FullItem = {
          userUid: this.firebaseSvc.currentUserId(),
          itemName: itemName,
          quality: {
            idQuality: selectedQuality.idQuality,
            qualityName: selectedQuality.qualityName
          },
          type: {
            idType: selectedType.idType,
            typeName: selectedType.typeName
          }
        };
        this.onRegister.emit(itemData);
      } else {
        console.error('Error: No se pudo encontrar la calidad o el tipo seleccionado');
      }
    }
  }

  async updateItem() {
    try {
        if (this.form && this.form.valid && this.itemId !== null) {
          const itemName = this.form.get('itemName')?.value;
          const selectedQuality = this.selectedQualities?.find(quality => quality.qualityName === this.form.get('qualityName')?.value);
          const selectedType = this.selectedTypes?.find(type => type.typeName === this.form.get('typeName')?.value);
  
          if (selectedQuality && selectedType) {
            const itemData: FullItem = {
              userUid: this.firebaseSvc.currentUserId(),
              itemName: itemName,
              quality: {
                idQuality: selectedQuality.idQuality,
                qualityName: selectedQuality.qualityName
              },
              type: {
                idType: selectedType.idType,
                typeName: selectedType.typeName
              }
            };
            await this.buildService.updateItem(this.itemId, itemData);
            this.router.navigate(['/item']);
          } else {
            console.error('Error: No se pudo encontrar la calidad o el tipo seleccionado');
          }
        }
    } catch (error) {
        console.error('Error al actualizar el item:', error);
        // Manejar el error si es necesario
    }
}


  handleShowMaxLengthErrorChange(showMaxLengthError: boolean) {
    this.showMaxLengthError = showMaxLengthError;
  }
}
