import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'input-text-with-icon',
  templateUrl: './input-text-with-icon.component.html',
  styleUrls: ['./input-text-with-icon.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextWithIconComponent),
      multi: true
    }
  ]
})
export class InputTextWithIconComponent implements ControlValueAccessor {
  @Input() iconPath!: string;
  @Input() label!: string;
  @Input() type: string = 'text'; // tipo del input (text, password, email, etc.)

  showPassword = false;

  // Método para alternar visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get inputType(): string {
    if (this.type !== 'password') return this.type;
    return this.showPassword ? 'text' : 'password';
  }

  get toggleIcon(): string {
    if (this.type !== 'password') return '';
    return this.showPassword
      ? 'assets/svg/icon-auth/password-show.svg'
      : 'assets/svg/icon-auth/password-hidden.svg';
  }

  value = '';
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  onInputChange(event: any) {
  const value = event.detail?.value ?? '';
  this.value = value;
  this.onChange(value);
  this.onTouched();
}
}