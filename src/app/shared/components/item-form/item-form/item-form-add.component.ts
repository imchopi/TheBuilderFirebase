import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FullItem, Quality, TestItem, Type } from 'src/app/core/interfaces/build';
import { BuildService } from 'src/app/core/services/build-info/build.service';

@Component({
  selector: 'app-item-form-add',
  templateUrl: './item-form-add.component.html',
  styleUrls: ['./item-form-add.component.scss'],
})
export class ItemFormAddComponent /*implements OnInit*/ {
  @Input() items: FullItem | null = null;
  @Output() onRegister = new EventEmitter<TestItem>();

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
    private formBuilder: FormBuilder,
    private buildService: BuildService,
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
  }

  onRegisterItem() {
    if (this.form && this.form.valid) {
      const itemData: TestItem = {
        itemName: this.form.get('itemName')?.value,
        qualityName: this.form.get('typeName')?.value,
        typeName: this.form.get('qualityName')?.value,
      };
      this.onRegister.emit(itemData);
    }
  }

  async updateItem() {
    try {
      if (this.form && this.form.valid && this.itemId !== null) {
        const itemData: FullItem = {
          itemName: this.form.get('itemname')?.value,
          quality: this.form.get('selectedQualities')?.value,
          type: this.form.get('selectedTypes')?.value,
        };

        await this.buildService.updateItem(this.itemId, itemData);
        this.router.navigate(['/item']);
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
