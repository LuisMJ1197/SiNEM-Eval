import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registros-asistencia',
  templateUrl: './registros-asistencia.component.html',
  styleUrls: ['./registros-asistencia.component.scss']
})
export class RegistrosAsistenciaComponent implements OnInit {

  registros = [
    {
      fecha: "7 de Abril del 2020"
    },
    {
      fecha: "7 de Abril del 2020"
    },
    {
      fecha: "7 de Abril del 2020"
    },
    {
      fecha: "7 de Noviembre del 2020"
    },
    {
      fecha: "7 de Abril del 2020"
    },
    {
      fecha: "7 de Abril del 2020"
    }
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goRegistro() {
    this.router.navigate(["my-courses/redonda-abril2020/registros-asistencia/10-05-2020"]);
  }

}