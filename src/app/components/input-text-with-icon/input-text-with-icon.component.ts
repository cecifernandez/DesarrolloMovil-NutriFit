import { Component, Input } from '@angular/core';

@Component({
  selector: 'input-text-with-icon',
  templateUrl: './input-text-with-icon.component.html',
  styleUrls: ['./input-text-with-icon.component.scss'],
  standalone: false
})
export class InputTextWithIconComponent {
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
}