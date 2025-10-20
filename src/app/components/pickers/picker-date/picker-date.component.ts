import {
  Component,
  forwardRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { MONTHS } from '@/app/constants/months.constants';

@Component({
  standalone: false,
  selector: 'picker-date',
  templateUrl: './picker-date.component.html',
  styleUrls: ['./picker-date.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PickerDateComponent),
      multi: true
    }
  ],
})
export class PickerDateComponent implements ControlValueAccessor {
  @ViewChild(IonModal) modal!: IonModal;
  days: number[] = [];
  months = MONTHS;
  years: number[] = [];

  selectedDay: number = 1;
  selectedMonth: number = 1;
  selectedYear: number = 2000;
  value: string = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    this.updateDay();
  }

  openModal() {
    this.modal.present();
  }

  closeModal(role: string) {
    if (role === 'confirm') {
      this.value = this.formatDate(this.selectedDay, this.selectedMonth, this.selectedYear);
      this.onChange(this.value); // actualiza el ngModel
      this.onTouched();
    }
    this.modal.dismiss();
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

  onDidDismiss() {
    this.onTouched();
  }

  onDayChange(e: any) {
    this.selectedDay = e.detail.value;
  }

  onMonthChange(e: any) {
    this.selectedMonth = e.detail.value;
    this.updateDay();
  }

  onYearChange(e: any) {
    this.selectedYear = e.detail.value;
    this.updateDay();
  }

  private updateDay() {
    const maxDays =  new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    this.days = Array.from({ length: maxDays }, (_, i) => i + 1);

    if (this.selectedDay > maxDays) this.selectedDay = maxDays;
  }

  private formatDate(day: number, month: number, year: number): string {
    const d = day.toString().padStart(2, '0');
    const m = month.toString().padStart(2, '0');
    return `${d}/${m}/${year}`;
  }
}
