
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';


@Component({
  selector: 'picker-peso',
  templateUrl: './picker-peso.component.html',
  styleUrls: ['./picker-peso.component.scss'],
  standalone: false,
})
export class PickerPesoComponent implements OnInit {
  @Input() placeholder: string = 'Selecciona el peso';
  @Input() value: string = 'Peso'; 
  @Output() valueSelected = new EventEmitter<string>();

  @ViewChild(IonModal) modal!: IonModal;

  pesoNumeros: number[] = [];
  unidades: string[] = ['kg'];

  selectedPeso: number = 70;
  selectedUnidad: string = 'kg';
  currentValue: string = '';

  ngOnInit(): void {
    this.pesoNumeros = Array.from({ length: 200 }, (_, i) => i + 1);
    this.currentValue = this.value || `${this.selectedPeso} ${this.selectedUnidad}`;
  }

  openModal() {
    this.modal.present();
  }

  closeModal(role: string) {
    this.modal.dismiss(`${this.selectedPeso} ${this.selectedUnidad}`, role);
    if (role === 'confirm') {
      this.currentValue = `${this.selectedPeso} ${this.selectedUnidad}`;
      this.valueSelected.emit(this.currentValue);
    }
  }

  onDidDismiss(event: CustomEvent) {
    const { role } = event.detail;
    if (role !== 'confirm') return;

    const newValue = event.detail.data;
    if (newValue) {
      this.currentValue = newValue;
      this.valueSelected.emit(this.currentValue);
    }
  }

  onPesoChange(value: any) {
    this.selectedPeso = value.detail?.value || value;
  }

  onUnidadChange(value: any) {
    this.selectedUnidad = value.detail?.value || value;
  }
}
