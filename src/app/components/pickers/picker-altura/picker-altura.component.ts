import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'picker-altura',
  templateUrl: './picker-altura.component.html',
  styleUrls: ['./picker-altura.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PickerAlturaComponent),
      multi: true
    }
  ],
})
export class PickerAlturaComponent implements ControlValueAccessor {
  @ViewChild(IonModal) modal!: IonModal;

  alturaNumeros: number[] = [];
  unidades: string[] = ['cm'];

  selectedAltura: number = 170;
  selectedUnidad: string = 'cm';
  value: string = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.alturaNumeros = Array.from({ length: 200 }, (_, i) => i + 1);
    this.value = `${this.selectedAltura} ${this.selectedUnidad}`;
  }

  openModal() {
    this.modal.present();
  }

  closeModal(role: string) {
    if (role === 'confirm') {
      this.value = `${this.selectedAltura} ${this.selectedUnidad}`;
      this.onChange(this.value); // actualiza el ngModel
      this.onTouched();
    }
    this.modal.dismiss();
  }

  onDidDismiss() {
    this.onTouched();
  }

  onAlturaChange(fn: any) {
    this.selectedAltura = Number(fn.detail.value);
  }

  onUnidadChange(fn: any) {
    this.selectedUnidad = fn.detail.value;
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
