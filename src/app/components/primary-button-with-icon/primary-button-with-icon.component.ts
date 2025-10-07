import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'primary-button-with-icon',
  templateUrl: './primary-button-with-icon.component.html',
  styleUrls: ['./primary-button-with-icon.component.scss'],
  standalone: false
})
export class PrimaryButtonWithIconComponent implements OnInit {
  @Input() iconPath!: string;
  @Input() label!: string;

  constructor() { }

  ngOnInit() {}
}