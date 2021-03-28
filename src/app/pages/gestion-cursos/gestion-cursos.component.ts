import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-cursos',
  templateUrl: './gestion-cursos.component.html',
  styleUrls: ['./gestion-cursos.component.scss']
})
export class GestionCursosComponent implements OnInit {
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
      tipo: "Negra",
      profesorAsignado: "Michelle Alvarado Zúñiga",
      periodo: "Abril 2020"
    },
    {
      tipo: "Corchea",
      profesorAsignado: "Luis Molina Juárez",
      periodo: "Abril 2020"
    },
    {
      tipo: "Semicorchea",
      profesorAsignado: "Luis Molina Juárez",
      periodo: "Abril 2020"
    },
    {
      tipo: "Blanca",
      profesorAsignado: "Michelle Alvarado Zúñiga",
      periodo: "Abril 2020"
    },
    {
      tipo: "Redonda",
      profesorAsignado: "James Mora Cortés",
      periodo: "Abril 2020"
    },
    {
      tipo: "Egresado",
      profesorAsignado: "Mauricio Murillo Brealey",
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
    this.router.navigate(["courses-management/corchea-abril2020"]);
  }

}
