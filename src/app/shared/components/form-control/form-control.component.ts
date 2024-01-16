import { Component, EventEmitter, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormControlComponent),
      multi: true
    }
  ]
})
export class FormControlComponent implements ControlValueAccessor {
  value: string = '';
  showMaxLengthError: boolean = false;
  @Output() showMaxLengthErrorChange = new EventEmitter<boolean>();
  writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInputChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    if (newValue.length <= 20) {
      this.value = newValue;
      this.onChange(newValue);
      this.onTouched();
      this.showMaxLengthError = false; // Oculta el mensaje de error si se encuentra visible
    } else {
      this.showMaxLengthError = true; // Muestra el mensaje de error
    }
    this.showMaxLengthErrorChange.emit(this.showMaxLengthError)
  }
}
