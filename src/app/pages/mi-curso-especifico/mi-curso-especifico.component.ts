import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { diasSemana, meses } from 'src/app/graphql/models';
import { ProfesorService } from 'src/app/services/profesor.service';

@Component({
  selector: 'app-mi-curso-especifico',
  templateUrl: './mi-curso-especifico.component.html',
  styleUrls: ['./mi-curso-especifico.component.scss']
})
export class MiCursoEspecificoComponent implements OnInit {
  @ViewChild("confirmFinalizar", {static: true}) private confirmFinalizar: any;

  tipos = {
    negra: "Negra",
    blanca: "Blanca",
    corchea: "Corchea",
    semicorchea: "Semicorchea",
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
  meses = meses;

  constructor(private router: Router, public pService: ProfesorService) {

  }

  ngOnInit(): void {
    if (this.pService.miCurso.curso_id == 0) {
      let url = this.router.url.split("/");
      let urlStr = url[url.length - 1];
      url = urlStr.split("-");
      this.pService.cargarCurso(Number(url[0]));
    }
  }

  getClass(tipo: string) {
    return this.tiposEstilos[tipo];
  }

  goList() {
    this.router.navigate([this.router.url.concat("/lista-estudiantes")]);
  }

  goRegistros() {
    this.router.navigate([this.router.url.concat("/registros-asistencia")]);
  }

  goMatriz() {
    this.router.navigate([this.router.url.concat("/matriz-evaluacion")]);
  }

  getHorarios() {
    let res = "";
    if (this.pService.miCurso != null) {
      this.pService.miCurso.horario.forEach(element => {
        res += diasSemana[element.dia - 1].concat(": ", element.hora_inicio, " - ", element.hora_fin, "<br>");
      });
    }
    return res;
  }

  finalizarCurso() {
    this.pService.finalizarCurso(this.pService.miCurso.curso_id)
      .subscribe(({data}) => {
        if (data != null && data['finalizarCurso'] != null) {
          if (data['finalizarCurso'].status == "ok") {
            this.pService.miCurso.isActivo = false;
            this.confirmFinalizar.nativeElement.click();
            alert("El curso ha sido finalizado.");
          }
        } else {
            alert("Ha ocurrido un error");
        }
      });
  }
}
