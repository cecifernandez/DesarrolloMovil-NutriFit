import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'card-rutin',
  templateUrl: './card-rutin.component.html',
  styleUrls: ['./card-rutin.component.scss'],
  standalone: false
})
export class CardRutinComponent  implements OnInit {
  constructor() { }

  ngOnInit() {}

  cards = [
    { title: 'Cardio', description: '10 Ejercicios programados', type: 'cardio', color: 'rgb(67, 97, 238, 40%)' },
    { title: 'Musculación', description: '10 Ejercicios programados', type: 'superior', color: 'rgb(255, 146, 43, 40%)' },
    { title: 'Piernas y Glúteos', description: '10 Ejercicios programados', type: 'inferior', color: 'rgb(56, 176, 0, 40%)' },
    { title: 'Entrenamiento de Fuerza', description: '10 Ejercicios programados', type: 'fuerza', color: 'rgb(255, 107, 107, 40%)' }
  ];
}
