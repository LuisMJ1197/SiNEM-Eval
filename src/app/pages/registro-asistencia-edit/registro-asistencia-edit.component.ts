import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { meses } from 'src/app/graphql/models';
import { EditarRegistroDeAsistencia } from 'src/app/graphql/queries';
import { ProfesorService } from 'src/app/services/profesor.service';

@Component({
  selector: 'app-registro-asistencia-edit',
  templateUrl: './registro-asistencia-edit.component.html',
  styleUrls: ['./registro-asistencia-edit.component.scss']
})
export class RegistroAsistenciaEditComponent implements OnInit {
  meses = meses;
  saving: boolean = false;

  constructor(public pService: ProfesorService, private router: Router, private apollo: Apollo) { }

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
      this.pService.cargarInfoRegistroDeAsistencia(this.pService.miCurso.curso_id, this.pService.registroDeAsistencia.numero_registro);
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
      this.apollo.mutate({
        mutation: EditarRegistroDeAsistencia,
        variables: {
          registros: registros_input
        }
      }).subscribe(({data}) => {
        if (data != null && data['editarRegistroDeAsistencia'] != null) {
          if (data['editarRegistroDeAsistencia'].status == "error") {
            alert("Ha ocurrido un error" + data['editarRegistroDeAsistencia'].errorNumber);
            this.saving = false;
          } else {
            this.saving = false;
          }
        } else {
          alert("Ha ocurrido un error");
          this.saving = false;
        }
      });
    } else {
      alert("Se tiene que indicar un estado para cada estudiante.");
    }
  }

}
