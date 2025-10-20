import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';

@Component({
  selector: 'objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss'],
  standalone: false,
})
export class ObjectiveComponent {
  @Input() label!: string;
  @Input() icon!: string;
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}