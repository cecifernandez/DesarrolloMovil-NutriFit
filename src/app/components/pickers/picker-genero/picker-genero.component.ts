import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';


@Component({
  selector: 'picker-genero',
  templateUrl: './picker-genero.component.html',
  styleUrls: ['./picker-genero.component.scss'],
  standalone:false
})

export class PickerGeneroComponent {
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() value: string = 'Género';

  @Output() valueSelected = new EventEmitter<string>();

  @ViewChild(IonModal) modal!: IonModal;

  currentValue: string = '';

  ngOnInit() {
    this.currentValue = this.value;
  }

  openModal() {
    this.modal.present();
  }

  closeModal(role: string) {
    this.modal.dismiss(this.currentValue, role);
    if (role === 'confirm') {
      this.valueSelected.emit(this.currentValue);
    }
  }

  onIonChange(event: CustomEvent) {
    this.currentValue = event.detail.value;
  }

  onDidDismiss(event: CustomEvent) {
    
  }
}
