import { Location } from '@angular/common';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { meses, RegistroDeAsistencia } from 'src/app/graphql/models';
import { AgregarRegistroDeAsistencia } from 'src/app/graphql/queries';
import { ProfesorService } from 'src/app/services/profesor.service';

@Component({
  selector: 'app-registros-asistencia',
  templateUrl: './registros-asistencia.component.html',
  styleUrls: ['./registros-asistencia.component.scss']
})
export class RegistrosAsistenciaComponent implements OnInit {
  @ViewChild ('dissmissAdd', {static: true}) public dissmissAdd: any;
  
  meses = meses;
  fecha: Date = new Date();
  estado_fecha: boolean = true;
  estado_msg = "";
  fechaFiltro: Date = new Date();
  
  constructor(private router: Router, public pService: ProfesorService, private apollo: Apollo, private toast: ToastrService) {
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
    this.fechaFiltro = new Date();
    this.fechaFiltro.setDate(this.fechaFiltro.getDate() - 1);
    console.log(new Date())
  }

  goRegistro(registro: RegistroDeAsistencia) {
    this.router.navigate([this.router.url.concat("/".concat(registro.numero_registro.toString()))]);
  }

  validarFecha(fecha: Date) {
    this.estado_fecha = true;
    this.estado_msg = "";
    let nfecha = new Date(fecha);
    nfecha.setDate(nfecha.getDate() + 1);
    if (nfecha > new Date()) {
      this.estado_fecha = false;
      this.estado_msg = "La fecha no puede ser mayor al día de hoy.";
    } else {
      for(let i = 0; i < this.pService.registrosDeAsistencia.length; i++) {
        let fechaP = this.pService.registrosDeAsistencia[i];
        let fechaParts = fechaP.fecha.split("/");
        if (new Date(Number(fechaParts[2]), Number(fechaParts[1]) - 1, Number(fechaParts[0])).toDateString() == nfecha.toDateString()) {
          this.estado_fecha = false;
          this.estado_msg = "Ya hay un registro de asistencia con esta fecha."
        }
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
            dia: this.fecha.getDate() + 1
          }
        }
      }).subscribe(({data}) => {
        if (data != null && data['agregarRegistroDeAsistencia'] != null) {
          if (data['agregarRegistroDeAsistencia'].status == "error") {
            this.toast.error("Ha ocurrido un error.", "", {positionClass: "toast-top-center"});
          } else {
            let numero_registro = data['agregarRegistroDeAsistencia'].resultData;
            this.dissmissAdd.nativeElement.click();
            // this.pService.cargarRegistrosDeAsistencia(this.pService.miCurso.curso_id);
            this.router.navigate([this.router.url.concat("/".concat(numero_registro.toString()))]);
          }
        } else {
          this.toast.error("Ha ocurrido un error.", "", {positionClass: "toast-top-center"});
        }
      });
    }
  }

  filtrarTodos() {
    this.pService.registrosFiltrados = JSON.parse(JSON.stringify(this.pService.registrosDeAsistencia));
  }

  filtrarPorFecha(fechaFiltro: Date) {
    let nfecha = new Date(fechaFiltro);
    nfecha.setDate(nfecha.getDate() + 1);
    this.pService.registrosFiltrados = this.pService.registrosDeAsistencia.filter(registro => {
      let fechaParts = registro.fecha.split("/");
      let daten = new Date(Number(fechaParts[2]), Number(fechaParts[1]) - 1, Number(fechaParts[0]));
      return daten.toDateString() == nfecha.toDateString();
    });
  }

  getFecha(fecha: string) {
    let fechaParts = fecha.split("/");
    return fechaParts[0] + "/" + fechaParts[1] + "/" + fechaParts[2];
  }
}