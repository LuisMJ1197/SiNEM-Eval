import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { meses } from 'src/app/graphql/models';
import { ProfesorService } from 'src/app/services/profesor.service';
import { Location } from '@angular/common';
import { ResultListener } from 'src/app/interfaces/result-listener';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro-asistencia-edit',
  templateUrl: './registro-asistencia-edit.component.html',
  styleUrls: ['./registro-asistencia-edit.component.scss']
})
export class RegistroAsistenciaEditComponent implements OnInit, ResultListener {
  GUARDAR_CAMBIOS = 0;
  ELIMINAR_REGISTRO = 1;

  meses = meses;
  saving: boolean = false;
  deleting: boolean = false;

  constructor(public pService: ProfesorService, private router: Router, private apollo: Apollo, private location: Location, private toast: ToastrService) { }

  ngOnInit(): void {
    if (this.pService.miCurso.curso_id == 0) {
      let url = this.router.url.split("/");
      let urlStr = url[url.length - 3];
      url = urlStr.split("-");
      this.pService.cargarCurso(Number(url[0]));
      // this.pService.cargarRegistrosDeAsistencia(Number(url[0]));
      let url2 = this.router.url.split("/");
      let urlStr2 = url2[url2.length - 1];
      this.pService.cargarInfoRegistroDeAsistencia(Number(url[0]), Number(urlStr2));
    } else {
      // this.pService.cargarRegistrosDeAsistencia(this.pService.miCurso.curso_id);
      let url2 = this.router.url.split("/");
      let urlStr2 = url2[url2.length - 1];
      this.pService.cargarInfoRegistroDeAsistencia(this.pService.miCurso.curso_id, Number(urlStr2));
    }
  }

  guardarCambios() {
    let state = true;
    let registros_input = [];
    this.pService.registroDeAsistencia.estado_por_estudiante.forEach(estado => {
      if (estado.estado == "Pendiente") {
        state = false;
      }
      registros_input.push({
        estado: estado.estado,
        estudiante_id: estado.estudiante_id,
        numero_registro: this.pService.registroDeAsistencia.numero_registro,
        curso_id: this.pService.registroDeAsistencia.curso_id
      });
    });
    if (state) {      
      this.saving = true;
      this.pService.guardarCambiosRegistroDeAsistencia(registros_input, this, this.GUARDAR_CAMBIOS);
    } else {
      this.toast.error("Se tiene que indicar un estado para cada estudiante.", "", {positionClass: "toast-top-center"});
    }
  }

  eliminarRegistro() {
    this.deleting = true;
    this.pService.eliminarRegistroDeAsistencia(this, this.ELIMINAR_REGISTRO);
  }

  handleResult(result: boolean, msg: string, action: number, resultData: number) {
    switch(action) {
      case this.GUARDAR_CAMBIOS: {
        if (result) {
          this.toast.success("Información de registro actualizada.", "", {positionClass: "toast-top-center"});
        } else {
          this.toast.error(msg, "", {positionClass: "toast-top-center"});
        }
        this.saving = false;
      }
      case this.ELIMINAR_REGISTRO: {
        if (result) {
          this.toast.success("Registro eliminado.", "", {positionClass: "toast-top-center"});
          this.location.back();
        } else {
          this.toast.error(msg, "", {positionClass: "toast-top-center"});
        }
        this.deleting = false;
      }
    }
  }
}
