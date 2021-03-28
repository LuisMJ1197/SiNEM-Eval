import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-cursos',
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.scss']
})
export class MisCursosComponent implements OnInit {
  tipos = {
    negra: "Negra",
    blanca: "Blanca",
    corchea: "Corchea",
    semicorchea: "Semicorche",
    redonda: "Redonda",
    egresado: "Egresado"
  };

  tiposEstilos = {
    Negra: "flaticon-negra",
    Blanca: "flaticon-blanca",
    Semicorchea: "flaticon-semicorchea",
    Corchea: "flaticon-nota-musical",
    Redonda: "flaticon-semibreve",
    Egresado: "flaticon-mortarboard"
  };

  cursos = [
    {
      tipo: "Corchea",
      profesorAsignado: "Luis Molina Juárez",
      periodo: "Abril 2020"
    },
    {
      tipo: "Semicorchea",
      profesorAsignado: "Luis Molina Juárez",
      periodo: "Abril 2020"
    }
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getClass(tipo: string) {
    return this.tiposEstilos[tipo];
  }

  goCourse() {
    this.router.navigate(["my-courses/corchea-abril2020"]);
  }

}
