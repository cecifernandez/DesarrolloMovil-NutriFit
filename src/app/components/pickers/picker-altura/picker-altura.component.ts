import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'picker-altura',
  templateUrl: './picker-altura.component.html',
  styleUrls: ['./picker-altura.component.scss'],
  standalone: false,
})
export class PickerAlturaComponent implements OnInit {

  @Input() placeholder: string = 'Selecciona la altura';
  @Input() value: string = 'Altura';
  @Output() valueSelected = new EventEmitter<string>();

  @ViewChild(IonModal) modal!: IonModal;

  alturaNumeros: number[] = [];
  unidades: string[] = ['cm'];

  selectedAltura: number = 170;
  selectedUnidad: string = 'cm';
  currentValue: string = '';

  ngOnInit(): void {
    this.alturaNumeros = Array.from({ length: 200 }, (_, i) => i + 1);
    this.currentValue = this.value || `${this.selectedAltura} ${this.selectedUnidad}`;
  }

  openModal() {
    
    this.modal.present();
  }

  closeModal(role: string) {
    this.modal.dismiss(`${this.selectedAltura} ${this.selectedUnidad}`, role);
    if (role === 'confirm') {
      this.currentValue = `${this.selectedAltura} ${this.selectedUnidad}`;
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

  onAlturaChange(value: any) {
    this.selectedAltura = value.detail?.value || value;
  }

  onUnidadChange(value: any) {
    this.selectedUnidad = value.detail?.value || value;
  }
}
