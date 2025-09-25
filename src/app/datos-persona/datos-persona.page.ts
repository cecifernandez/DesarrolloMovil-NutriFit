import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-datos-persona',
  templateUrl: './datos-persona.page.html',
  styleUrls: ['./datos-persona.page.scss'],
  standalone: false
})
export class DatosPersonaPage implements OnInit {

 selectedLanguage: string = ''
  constructor() { }

  ngOnInit() {
  }

}
