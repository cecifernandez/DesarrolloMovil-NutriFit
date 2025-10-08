import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ObjIcon } from '../../enum/objective-icon/objective-icon';
import { ObjText } from '../../enum/objective-text/objective-text';

@Component({
  selector: 'objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss'],
  standalone: false,
})
export class ObjectiveComponent {
  @Input() type!: keyof typeof ObjIcon;
  
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  ObjIcon = ObjIcon;
  ObjText = ObjText;

  get resolvedLabel(): string {
    return this.type ? ObjText[this.type as keyof typeof ObjText] || '' : '';
  }

  get resolvedIcon(): string {
    return this.type ? ObjIcon[this.type as keyof typeof ObjIcon] || '' : '';
  }

  onToggle(checked: boolean) {
    this.checked = checked;
    this.checkedChange.emit(checked);
  }
}