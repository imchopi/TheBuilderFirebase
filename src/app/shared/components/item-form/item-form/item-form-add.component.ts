import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {
  Item,
  ItemPayload,
  Qualities,
  Types,
} from 'src/app/core/interfaces/build';
import { BuildService } from 'src/app/core/services/build-info/build.service';

@Component({
  selector: 'app-item-form-add',
  templateUrl: './item-form-add.component.html',
  styleUrls: ['./item-form-add.component.scss'],
})
export class ItemFormAddComponent implements OnInit {
  @Input() items: Item | null = null;
  @Output() onRegister = new EventEmitter<ItemPayload>();

  form: FormGroup;
  mode = false;
  itemname: string | null = null;
  infoItem: Item[] | null = null;
  selectedQualities: Qualities[] | null = null;
  selectedTypes: Types[] | null = null;
  itemId: number | null = null;
  showMaxLengthError: boolean = false;

  @Input() set item(_item: Item | null) {
    if (_item) {
      this.form.controls['itemname'].setValue(_item.attributes.item_name);
      this.form.controls['selectedQualities'].setValue(
        _item.attributes.quality_id.data.id
      );
      this.form.controls['selectedTypes'].setValue(
        _item.attributes.type_id.data.id
      );
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private buildService: BuildService,
    private _modal: ModalController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      itemname: ['', Validators.required],
      selectedQualities: [null, Validators.required],
      selectedTypes: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.buildService.getQualities().subscribe((response) => {
      this.selectedQualities = response;
    });
    this.buildService.getTypes().subscribe((response) => {
      this.selectedTypes = response;
    });
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const itemIdParam = paramMap.get('itemId');
      if (itemIdParam) {
        this.mode = true;
        this.itemId = Number(itemIdParam);
        const itemId = Number(itemIdParam);
        this.buildService.getItemById(itemId).subscribe(
          (res) => {
            this.item = res;
          },
        );
      }
    });
  }

  onRegisterItem() {
    if (this.form && this.form.valid) {
      const itemData: ItemPayload = {
        item_name: this.form.get('itemname')?.value,
        quality_id: this.form.get('selectedQualities')?.value,
        type_id: this.form.get('selectedTypes')?.value,
      };
      this.onRegister.emit(itemData);
    }
  }

  updateItem() {
    if (this.form && this.form.valid && this.itemId !== null) {
      const itemData: ItemPayload = {
        item_name: this.form.get('itemname')?.value,
        quality_id: this.form.get('selectedQualities')?.value,
        type_id: this.form.get('selectedTypes')?.value,
      };

      this.buildService.updateItem(this.itemId, itemData).subscribe(
        (res) => {
          this.router.navigate(['/item']);
        },
        (err) => {
          console.error('Error al actualizar el item:', err);
        }
      );
    }
  }

  handleShowMaxLengthErrorChange(showMaxLengthError: boolean) {
    this.showMaxLengthError = showMaxLengthError;
  }
}
