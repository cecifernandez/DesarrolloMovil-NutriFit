import { Component, Input, OnInit, Output, EventEmitter, HostBinding } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';

@Component({
  selector: 'secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.scss'],
  standalone: false
})
export class SecondaryButtonComponent implements OnInit {
  @Input() propEnum!: ButtonText;
  @Input() active: boolean = false;

  @Output() buttonClick = new EventEmitter<void>();

  @HostBinding('class.active') get isActive() {
    return this.active;
  }
  onClick() {
    this.buttonClick.emit();
  }

  constructor() { }

  ngOnInit() { }


}