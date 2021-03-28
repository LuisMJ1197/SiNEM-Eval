import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-curso-especifico',
  templateUrl: './mi-curso-especifico.component.html',
  styleUrls: ['./mi-curso-especifico.component.scss']
})
export class MiCursoEspecificoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goList() {
    this.router.navigate(["my-courses/redonda-abril2020/lista-estudiantes"]);
  }

  goRegistros() {
    this.router.navigate(["my-courses/redonda-abril2020/registros-asistencia"]);
  }

  goMatriz() {
    this.router.navigate(["my-courses/redonda-abril2020/matriz-evaluacion"]);
  }
}
