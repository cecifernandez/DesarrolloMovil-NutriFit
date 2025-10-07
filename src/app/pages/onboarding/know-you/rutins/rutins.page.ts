import { Component, OnInit } from '@angular/core';

import { ButtonText } from '@/app/enum/button-text/button-text';

@Component({
  selector: 'rutins',
  templateUrl: './rutins.page.html',
  styleUrls: ['./rutins.page.scss'],
  standalone: false
})
export class RutinsPage implements OnInit {
  ButtonText = ButtonText;

  constructor() { }

  ngOnInit() { }
}
