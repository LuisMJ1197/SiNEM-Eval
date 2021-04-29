import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { diasSemana, meses, tiposEstilos } from 'src/app/graphql/models';
import { GestionCursosService } from 'src/app/services/gestion-cursos.service';

@Component({
  selector: 'app-gestion-curso-especifico',
  templateUrl: './gestion-curso-especifico.component.html',
  styleUrls: ['./gestion-curso-especifico.component.scss']
})
export class GestionCursoEspecificoComponent implements OnInit {
  @ViewChild("dismissConfirm", {static: true}) private dismissConfirm: any;
  @ViewChild("dismissAddEstudiantes", {static: true}) private dismissAddEstudiantes: any;

  meses = meses;
  tiposEstilos = tiposEstilos;
  selected_ids = [];
  selected_all = false;

  constructor(private router: Router, public gcService: GestionCursosService) { }

  ngOnInit(): void {
    if (this.gcService.cursoEspecifico.curso_id == 0) {
      let url = this.router.url.split("/");
      let urlStr = url[url.length - 1];
      url = urlStr.split("-");
      this.gcService.cargarCurso(Number(url[0]));
    } else {
      this.gcService.cargarListaDeEstudiantes(this.gcService.cursoEspecifico.curso_id);
      this.gcService.cargarTodosLosEstudiantes();
    }
  }

  sortByName(lista) {
    return lista.sort((a, b) => {
      let nombreA = "".concat(" ", a.apellido1, " ", a.apellido2);
      let nombreB = "".concat(" ", b.apellido1, " ", b.apellido2);
      return nombreA > nombreB ? 1 : nombreA === nombreB ? 0 : -1;
    });
  }

  getClass(tipo: string) {
    return this.tiposEstilos[tipo];
  }

  selectAll(selected) {
    if (selected) {
      this.selected_all = true;
      this.selected_ids = [];
      this.gcService.todosEstudiantes.forEach(est => this.select(est.estudiante_id, true));
    } else {
      this.selected_all = false;
      this.selected_ids = [];
    }
  }

  select(estudiante_id, selected) {
    if (selected && !this.isSelected(estudiante_id)) {
      this.selected_ids.push(estudiante_id);
    } else {
      this.selected_all = false;
      this.selected_ids = this.selected_ids.filter(id_ => {
        if (!this.alreadyInCourse(estudiante_id)) {
          return estudiante_id != id_
        }
        return false;
      });
    }
  }

  isSelected(id) {
    return this.selected_ids.filter(id_ => id == id_).length > 0;
  }

  alreadyInCourse(estudiante_id) {
    return this.gcService.listaEstudiantes.filter(est => est.estudiante_id == estudiante_id);
  }

  agregarEstudiantes() {
    if (this.selected_ids.length == 0) {
      this.dismissAddEstudiantes.nativeElement.click();
      return;
    } else {
      let estudiantes_agregar = [];
      this.gcService.todosEstudiantes.forEach(estudiante => {
        if (this.isSelected(estudiante.estudiante_id)) {
          estudiantes_agregar.push(estudiante);
        }
      });
      this.gcService.agregarEstudiantesACuros(estudiantes_agregar, this);
    }
  }

  terminarAgregarEstudiantesACurso(result: boolean, msg: string) {
    if (result) {
      this.dismissAddEstudiantes.nativeElement.click();
      this.gcService.cargarListaDeEstudiantes(this.gcService.cursoEspecifico.curso_id);
      this.selected_ids = [];
    } else {
      alert(msg);
    }
  }

  getHorarios() {
    let res = "";
    if (this.gcService.cursoEspecifico != null) {
      this.gcService.cursoEspecifico.horario.forEach(element => {
        res += diasSemana[element.dia - 1].concat(": ", element.hora_inicio, " - ", element.hora_fin, "<br>");
      });
    }
    return res;
  }

  finalizarCurso() {
    this.gcService.finalizarCurso(this.gcService.cursoEspecifico.curso_id)
      .subscribe(({data}) => {
        if (data != null && data['finalizarCurso'] != null) {
          if (data['finalizarCurso'].status == "ok") {
            this.gcService.cursoEspecifico.isActivo = false;
            this.dismissConfirm.nativeElement.click();
            alert("El curso ha sido finalizado.");
          }
        } else {
            alert("Ha ocurrido un error");
        }
      });
  }

}
