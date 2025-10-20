
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'picker-peso',
  templateUrl: './picker-peso.component.html',
  styleUrls: ['./picker-peso.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PickerPesoComponent),
      multi: true,
    },
  ],
})
export class PickerPesoComponent implements ControlValueAccessor {
  @ViewChild(IonModal) modal!: IonModal;
  
  pesoNumeros: number[] = [];
  unidades: string[] = ['kg', 'lbs'];

  selectedPeso: number = 70;
  selectedUnidad: string = 'kg';
  value: string = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.pesoNumeros = Array.from({ length: 200 }, (_, i) => i + 1);
    this.value = `${this.selectedPeso} ${this.selectedUnidad}`;
  }

  openModal() {
    this.modal.present();
  }

  closeModal(role: string) {
    if (role === 'confirm') {
      this.value = `${this.selectedPeso} ${this.selectedUnidad}`;
      this.onChange(this.value); // actualiza el ngModel
      this.onTouched();
    }
    this.modal.dismiss();
  }

  onDidDismiss() {
    this.onTouched();
  }

  onPesoChange(value: any) {
    this.selectedPeso = Number(value.detail.value || value);
  }

  onUnidadChange(value: any) {
    this.selectedUnidad = value.detail.value || value;
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
