import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'secondary-button-with-icon',
  templateUrl: './secondary-button-with-icon.component.html',
  styleUrls: ['./secondary-button-with-icon.component.scss'],
  standalone: false
})
export class SecondaryButtonWithIconComponent implements OnInit {
  @Input() iconPath!: string;
  @Input() label!: string;

  constructor() { }

  ngOnInit() { }
}
