import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { diasSemana, Estudiante, meses, tiposEstilos } from 'src/app/graphql/models';
import { GestionCursosService } from 'src/app/services/gestion-cursos.service';

@Component({
  selector: 'app-gestion-curso-especifico',
  templateUrl: './gestion-curso-especifico.component.html',
  styleUrls: ['./gestion-curso-especifico.component.scss']
})
export class GestionCursoEspecificoComponent implements OnInit {
  @ViewChild("dismissConfirm", {static: true}) private dismissConfirm: any;
  @ViewChild("dismissAddEstudiantes", {static: true}) private dismissAddEstudiantes: any;
  @ViewChild("dismissDarbaja", {static: true}) private dismissDarbaja: any;

  meses = meses;
  tiposEstilos = tiposEstilos;
  selected_ids = [];
  selected_all = false;
  estudianteDeBaja: Estudiante = null;

  constructor(private router: Router, public gcService: GestionCursosService, private toast: ToastrService) { }

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
  
  /**
   * Recibe una lista de estudiantes y los ordena de acuerdo a su nombre.
   * @param lista lista de estudiantes
   * @returns lista ordenada por el nombre alfabéticamente.
   */
  sortByName(lista) {
    return lista.sort((a, b) => {
      let nombreA = "".concat(" ", a.apellido1, " ", a.apellido2, " ", a.nombre);
      let nombreB = "".concat(" ", b.apellido1, " ", b.apellido2, " ", b.nombre);
      return nombreA > nombreB ? 1 : nombreA === nombreB ? 0 : -1;
    });
  }

  /**
   * Recibe un string y devuelve un valor de acuerdo a ese string como elemento de un json.
   * @param tipo string
   * @returns string
   */
  getClass(tipo: string) {
    return this.tiposEstilos[tipo];
  }

  /**
   * Incluye o elimina el id de todos los estudiantes en la lista selected_ids.
   * @param selected booleano, si es verdadero los incluye, si es falso los elimina.
   */
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

  /**
   * Incluye o elimina el id de un estudiante en la lista selected_ids.
   * @param estudiante_id id del estudiante
   * @param selected boolean, si es true lo incluye, si es false lo elimina.
   */
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

  /**
   * Consulta si un estudiante se encuentra seleccionado.
   * @param id id del estudiante
   * @returns true si está en la lista, false en caso contrario.
   */
  isSelected(id) {
    return this.selected_ids.filter(id_ => id == id_).length > 0;
  }

  /**
   * Consulta si un estudiante ya está agregado a la lista de estudiantes. 
   * @param estudiante_id id del estudiante
   * @returns true si ya está en la lista, false en caso contrario.
   */
  alreadyInCourse(estudiante_id) {
    return this.gcService.listaEstudiantes.filter(est => est.estudiante_id == estudiante_id).length > 0;
  }

  /**
   * Agregar a los estudiantes seleccionados a la lista de estudiantes.
   * @returns 
   */
  agregarEstudiantes() {
    if (this.selected_ids.length == 0) {
      this.dismissAddEstudiantes.nativeElement.click();
      return;
    } else {
      let estudiantes_agregar = [];
      this.gcService.todosEstudiantes.forEach(estudiante => {
        if (this.isSelected(estudiante.estudiante_id)) {
          estudiantes_agregar.push({estudiante_id: estudiante.estudiante_id, curso_id: this.gcService.cursoEspecifico.curso_id});
        }
      });
      this.gcService.agregarEstudiantesACuros(estudiantes_agregar, this);
    }
  }

  /**
   * Función callback para manejar el resultado de agregar los estudiantes al curso.
   * @param result true si fue exitoso, false en caso contrario.
   * @param msg menaje de error en caso de haberse generado.
   */
  terminarAgregarEstudiantesACurso(result: boolean, msg: string) {
    if (result) {
      this.dismissAddEstudiantes.nativeElement.click();
      this.gcService.cargarListaDeEstudiantes(this.gcService.cursoEspecifico.curso_id);
      this.selected_ids = [];
      this.toast.success("El estudiante ha sido agregado al curso.", "", {positionClass: "toast-top-center"});
    } else {
      alert(msg);
    }
  }

  /**
   * Crea un string con un formato específico para mostrar los horarios de un curso.
   * @returns un string con formato
   */
  getHorarios() {
    let res = "";
    if (this.gcService.cursoEspecifico != null) {
      this.gcService.cursoEspecifico.horario.forEach(element => {
        res += diasSemana[element.dia - 1].concat(": ", element.hora_inicio, " - ", element.hora_fin, "<br>");
      });
    }
    return res;
  }

  /**
   * Establece el estado del curso como finalizado.
   */
  finalizarCurso() {
    this.gcService.finalizarCurso(this.gcService.cursoEspecifico.curso_id)
      .subscribe(({data}) => {
        if (data != null && data['finalizarCurso'] != null) {
          if (data['finalizarCurso'].status == "ok") {
            this.gcService.cursoEspecifico.isActivo = false;
            this.dismissConfirm.nativeElement.click();
            this.toast.success("El curso ha sido finalizado.", "", {positionClass: "toast-top-center"});
          }
        } else {
          this.toast.error("Ha ocurrido un error.", "", {positionClass: "toast-top-center"});
        }
      });
  }

  /**
   * Elimina o excluye a un estudiante del curso.
   */
  darDeBaja() {
    this.gcService.darDeBaja(this.estudianteDeBaja.estudiante_id, this.gcService.cursoEspecifico.curso_id, this);
  }

  /**
   * Función de callback para manejar el resultado de dar de baja a un estudiante.
   * @param result true si el resultado fue exitoso, false en caso contrario
   * @param msg mensaje de error.
   */
  terminarDarDebaja(result: boolean, msg: string) {
    if (result) {
      this.dismissDarbaja.nativeElement.click();
      this.gcService.cargarListaDeEstudiantes(this.gcService.cursoEspecifico.curso_id);
      this.toast.success("El estudiante ha sido dado de baja.", "", {positionClass: "toast-top-center"});
    } else {
      this.toast.error(msg, "", {positionClass: "toast-top-center"});
    }
  }
}
