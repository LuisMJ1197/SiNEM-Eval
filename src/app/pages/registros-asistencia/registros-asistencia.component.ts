import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import moment from 'moment';
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
  fechaFiltro: Date = new Date();
  
  constructor(private router: Router, public pService: ProfesorService, private apollo: Apollo) {
    this.fechaFiltro.setDate(this.fechaFiltro.getDate() - 1);
    this.fecha.setDate(this.fecha.getDate() - 1);
  }

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
    this.fecha.setDate(this.fecha.getDate() - 1);
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
    this.validarFecha(this.fecha);
    if (this.estado_fecha) {
      this.apollo.mutate({
        mutation: AgregarRegistroDeAsistencia,
        variables: {
          registro: {
            curso_id: this.pService.miCurso.curso_id,
            anno: this.fecha.getFullYear(),
            mes: this.fecha.getMonth() + 1,
            dia: this.fecha.getDate()
          }
        }
      }).subscribe(({data}) => {
        if (data != null && data['agregarRegistroDeAsistencia'] != null) {
          if (data['agregarRegistroDeAsistencia'].status == "error") {
            alert("Ha ocurrido un error. ");
          } else {
            let numero_registro = data['agregarRegistroDeAsistencia'].resultData;
            // this.pService.cargarRegistrosDeAsistencia(this.pService.miCurso.curso_id);
            this.router.navigate([this.router.url.concat("/".concat(numero_registro.toString()))]);
          }
        } else {
          alert("Ha ocurrido un error. ");
        }
      });
    }
  }

  filtrarTodos() {
    this.pService.registrosFiltrados = JSON.parse(JSON.stringify(this.pService.registrosDeAsistencia));
  }

  filtrarPorFecha(fechaFiltro: Date) {
    this.pService.registrosFiltrados = this.pService.registrosDeAsistencia.filter(registro => {
      let fe = new Date(fechaFiltro);
      fe.setDate(fe.getDate() + 1);
      return this.getFecha(registro.fecha) == fe.toLocaleDateString();
    });
  }

  getFecha(fecha: string) {
    let fechaParts = fecha.split("/");
    return fechaParts[1] + "/" + fechaParts[0] + "/" + fechaParts[2];
  }
}