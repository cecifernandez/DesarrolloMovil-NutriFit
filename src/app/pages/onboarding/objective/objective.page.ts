import { Component, OnInit } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';

@Component({
  selector: 'app-objective',
  templateUrl: './objective.page.html',
  styleUrls: ['./objective.page.scss'],
  standalone: false
})
export class ObjectivePage implements OnInit {
  ButtonText = ButtonText;

  constructor() { }

  ngOnInit() { }
}
