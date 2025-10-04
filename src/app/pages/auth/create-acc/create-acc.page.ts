import { Component, OnInit } from '@angular/core';

import { InputText } from '../../../enum/input-text/input-text';

@Component({
  selector: 'app-create-acc',
  templateUrl: './create-acc.page.html',
  styleUrls: ['./create-acc.page.scss'],
  standalone: false
})
export class CreateAccPage implements OnInit {
  InputText = InputText;
  constructor() { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
