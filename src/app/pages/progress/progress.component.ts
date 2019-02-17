import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  progreso1: number = 20;
  progreso2: number = 40;

  constructor() { }

  ngOnInit() {
  }

  // función para recibir el evento
  // actualizar(event: number) {
  //   console.log('Evento: ', event);
  // }

}
