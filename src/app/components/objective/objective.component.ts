import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss'],
  standalone: false,
})
export class ObjectiveComponent {
  @Input() label!: string;
  @Input() icon!: string;
  @Input() active: boolean = false;
  @Output() selected = new EventEmitter<boolean>();

  toggle() {
    this.active = !this.active;
    this.selected.emit(this.active);
  }
}