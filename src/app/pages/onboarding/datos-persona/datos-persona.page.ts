import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ButtonText } from '../../../enum/button-text/button-text';
import { ButtonIcon } from '../../../enum/button-icon/button-icon';


@Component({
  selector: 'app-datos-persona',
  templateUrl: './datos-persona.page.html',
  styleUrls: ['./datos-persona.page.scss'],
  standalone: false
})
export class DatosPersonaPage implements OnInit {

  ButtonText = ButtonText;
  ButtonIcon = ButtonIcon;

  constructor() { }

  ngOnInit() {
  }

}
