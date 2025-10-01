import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'picker-date',
  templateUrl: './picker-date.component.html',
  styleUrls: ['./picker-date.component.scss'],
})
export class PickerDateComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Output() valueSelected = new EventEmitter<string>();

  @ViewChild(IonModal) modal!: IonModal;

  days: number[] = [];
  months: { name: string; value: number }[] = [];
  years: number[] = [];

  selectedDay: number = 1;
  selectedMonth: number = 1;
  selectedYear: number = 2000;

  currentValue: string = '';

  ngOnInit(): void {
    this.months = [
      { name: 'Enero', value: 1 },
      { name: 'Febrero', value: 2 },
      { name: 'Marzo', value: 3 },
      { name: 'Abril', value: 4 },
      { name: 'Mayo', value: 5 },
      { name: 'Junio', value: 6 },
      { name: 'Julio', value: 7 },
      { name: 'Agosto', value: 8 },
      { name: 'Septiembre', value: 9 },
      { name: 'Octubre', value: 10 },
      { name: 'Noviembre', value: 11 },
      { name: 'Diciembre', value: 12 },
    ];

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    if (this.value) {
      const [day, month, year] = this.value.split('/').map(Number);
      this.selectedDay = day;
      this.selectedMonth = month;
      this.selectedYear = year;
    }

    this.actualizarDias();
    this.currentValue = this.formatDate(this.selectedDay, this.selectedMonth, this.selectedYear);
  }

  openModal() {
    this.modal.present();
  }

  closeModal(role: string) {
    const formatted = this.formatDate(this.selectedDay, this.selectedMonth, this.selectedYear);
    this.modal.dismiss(formatted, role);

    if (role === 'confirm') {
      this.currentValue = formatted;
      this.valueSelected.emit(formatted);
    }
  }

  onDidDismiss(event: CustomEvent) {
    const { role, data } = event.detail;
    if (role !== 'confirm') return;

    this.currentValue = data;
    this.valueSelected.emit(data);
  }

  onDayChange(event: any) {
    this.selectedDay = Number(event.detail?.value);
  }

  onMonthChange(event: any) {
    this.selectedMonth = Number(event.detail?.value);
    this.actualizarDias();
  }

  onYearChange(event: any) {
    this.selectedYear = Number(event.detail?.value);
    this.actualizarDias();
  }

  private actualizarDias() {
    const maxDays = this.getDaysInMonth(this.selectedMonth, this.selectedYear);
    this.days = Array.from({ length: maxDays }, (_, i) => i + 1);

    if (this.selectedDay > maxDays) {
      this.selectedDay = maxDays;
    }
  }

  private getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  private formatDate(day: number, month: number, year: number): string {
    const d = day.toString().padStart(2, '0');
    const m = month.toString().padStart(2, '0');
    return `${d}/${m}/${year}`;
  }
}
