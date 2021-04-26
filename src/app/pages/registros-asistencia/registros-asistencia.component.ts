import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { meses, RegistroDeAsistencia } from 'src/app/graphql/models';
import { AgregarRegistroDeAsistencia } from 'src/app/graphql/queries';
import { ProfesorService } from 'src/app/services/profesor.service';

@Component({
  selector: 'app-registros-asistencia',
  templateUrl: './registros-asistencia.component.html',
  styleUrls: ['./registros-asistencia.component.scss']
})
export class RegistrosAsistenciaComponent implements OnInit {
  meses = meses;
  fecha: Date = new Date();
  estado_fecha: boolean = true;
  estado_msg = "";

  constructor(private router: Router, public pService: ProfesorService, private apollo: Apollo) { }

  ngOnInit(): void {
    if (this.pService.miCurso.curso_id == 0) {
      let url = this.router.url.split("/");
      let urlStr = url[url.length - 2];
      url = urlStr.split("-");
      this.pService.cargarCurso(Number(url[0]));
      this.pService.cargarRegistrosDeAsistencia(Number(url[0]));
    } else {
      this.pService.cargarRegistrosDeAsistencia(this.pService.miCurso.curso_id);
    }
    this.setFechaActual();
  }

  setFechaActual() {
    this.fecha = new Date();
  }

  goRegistro(registro: RegistroDeAsistencia) {
    this.router.navigate([this.router.url.concat("/".concat(registro.numero_registro.toString()))]);
  }

  validarFecha(fecha: Date) {
    if (fecha > new Date()) {
      this.estado_fecha = false;
      this.estado_msg = "La fecha no puede ser mayor al día de hoy.";
    } else {
      this.estado_fecha = true;
      this.pService.registrosDeAsistencia.forEach(fecha => {
        if (new Date(fecha.fecha) == this.fecha) {
          this.estado_fecha = false;
          this.estado_msg = "Ya hay un registro de asistencia con esta fecha."
        }
      });
      if (this.estado_fecha) {
        this.estado_msg = "";
      }
    }
  }
  agregarRegistro() {
    this.apollo.mutate({
      mutation: AgregarRegistroDeAsistencia,
      variables: {
        curso_id: this.pService.miCurso.curso_id,
        anno: this.fecha.getFullYear(),
        mes: this.fecha.getMonth() + 1,
        dia: this.fecha.getDate()
      }
    }).subscribe(({data}) => {
      if (data != null && data['agregarRegistroDeAsistencia'] != null) {
        if (data['agregarRegistroDeAsistencia'].status == "error") {
          alert("Ha ocurrido un error.");
        }
      } else {
        let numero_registro = data['agregarRegistroDeAsistencia'].resultData;
        this.router.navigate([this.router.url.concat("/".concat(numero_registro.toString()))]);
      }
    });
  }
}