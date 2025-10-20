import { Component, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'picker-genero',
  templateUrl: './picker-genero.component.html',
  styleUrls: ['./picker-genero.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PickerGeneroComponent),
      multi: true,
    },
  ],
})

export class PickerGeneroComponent implements ControlValueAccessor {
  @Input() value: string = '';

  @ViewChild(IonModal) modal!: IonModal;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  private _options: string[] = ['Femenino', 'Masculino', 'Otro'];

  @Input()
  set options(value: string[]) {
    if (value && value.length) {
      this._options = value;
    }
  }

  get options(): string[] {
    return this._options;
  }

  currentValue: string = '';

  ngOnInit() {
    this.currentValue = this.value;
  }

  openModal() {
    this.modal.present();
  }

  closeModal(role: string) {
    if (role === 'confirm') {
      this.value = this.currentValue;
      this.onChange(this.value); // actualiza el ngModel
      this.onTouched();
    }
    this.modal.dismiss();
  }

  onIonChange(event: CustomEvent) {
    this.currentValue = event.detail.value;
  }

  onDidDismiss() {
    this.onTouched();
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
