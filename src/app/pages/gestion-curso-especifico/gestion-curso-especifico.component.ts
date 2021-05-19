import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Curso, diasSemana, Estudiante, meses, tipos, tiposEstilos } from 'src/app/graphql/models';
import { EditarCurso } from 'src/app/graphql/queries';
import { ResultListener } from 'src/app/interfaces/result-listener';
import { GestionCursosService } from 'src/app/services/gestion-cursos.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gestion-curso-especifico',
  templateUrl: './gestion-curso-especifico.component.html',
  styleUrls: ['./gestion-curso-especifico.component.scss']
})
export class GestionCursoEspecificoComponent implements OnInit, ResultListener {
  private FINALIZAR_CURSO = 0;
  private EDITAR_CURSO = 1;

  @ViewChild("dismissConfirm", {static: true}) private dismissConfirm: any;
  @ViewChild("dismissAddEstudiantes", {static: true}) private dismissAddEstudiantes: any;
  @ViewChild("dismissDarbaja", {static: true}) private dismissDarbaja: any;
  @ViewChild("displayErrorHorario", {static: true}) private displayErrorHorario: any;
  @ViewChild("dismissAgregarCurso", {static: true}) private dismissAgregarCurso: any;

  meses = meses;
  tiposEstilos = tiposEstilos;
  selected_ids = [];
  selected_all = false;
  estudianteDeBaja: Estudiante = null;
  tipoFilter = 0;
  tipos = tipos;
  dias = diasSemana;

  errorHorarioMsg = "";
  tipoSelected: number = 1;
  modalidadSelected: number = 1;
  instrumentoSelected: number = 1;
  profesorAsignado: number = 1;
  periodoSelected: string = "";
  horarios: any[] = [];
  nuevoHorario = {
    dia: 2,
    hora_inicio: "",
    hora_fin: ""
  }
  filter_text = "";
  
  setEditCurso() {
    this.tipoSelected = this.gcService.cursoEspecifico.tipo_curso.tipo_id;
    this.modalidadSelected = this.gcService.cursoEspecifico.modalidad.modalidad_id;
    this.profesorAsignado = this.gcService.cursoEspecifico.profesor_asignado.profesor_id;
    this.periodoSelected = this.gcService.cursoEspecifico.anno_periodo.toString().concat("-", 
      this.gcService.cursoEspecifico.mes_periodo < 10 ? "0".concat(this.gcService.cursoEspecifico.mes_periodo.toString()) : this.gcService.cursoEspecifico.mes_periodo.toString());
    this.horarios = this.gcService.cursoEspecifico.horario;
    this.instrumentoSelected = -1;
    this.instrumentoSelected = this.uService.modalidades.filter(elem => elem.modalidad_id == this.modalidadSelected)[0]
      .instrumentos.filter(elem => elem.instrumento_name == this.gcService.cursoEspecifico.modalidad.instrumento_name)[0];
  }

  constructor(private router: Router, public gcService: GestionCursosService, private toast: ToastrService, public uService: UtilsService) { }

  filterStudents() {
    if (this.filter_text == "") {
      this.gcService.todosEstudiantesFiltered = JSON.parse(JSON.stringify(this.gcService.todosEstudiantes));
    } else {
      if (this.tipoFilter == 0) {
        this.gcService.todosEstudiantesFiltered = this.gcService.todosEstudiantes.filter(std => {
          return std.apellido1.concat(" ", std.apellido2, " ", std.nombre).toLowerCase().includes(this.filter_text.toLowerCase());
        });
      } else {
        this.gcService.todosEstudiantesFiltered = this.gcService.todosEstudiantes.filter(std => {
          return std.cedula.includes(this.filter_text.toLowerCase());
        });
      }
    }
  }

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
    this.gcService.finalizarCurso(this.gcService.cursoEspecifico.curso_id, this.FINALIZAR_CURSO, this);
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

  editarCurso() {
    let curso = {
      curso_id: this.gcService.cursoEspecifico.curso_id,
      sede_id: 1,
      rubrica_id: 1,
      profesor_id: Number(this.profesorAsignado),
      modalidad_id: Number(this.modalidadSelected),
      instrumento_id: Number(this.instrumentoSelected),
      tipo_id: Number(this.tipoSelected),
      anno_periodo: this.periodoSelected.split("-")[0],
      mes_periodo: Number(this.periodoSelected.split("-")[1]),
      horario: this.horarios
    };
    if (this.periodoSelected != "") {
      if (this.horarios.length > 0) {
        this.horarios.forEach(horario => horario.dia = Number(horario.dia));
        this.gcService.editarCurso(curso, this, this.EDITAR_CURSO);
      } else {
        this.errorHorarioMsg = "Debe seleccionar al menos un horario.";
        this.displayErrorHorario.nativeElement.click();
      }
    } else {
      this.errorHorarioMsg = "Debe seleccionar un período.";
      this.displayErrorHorario.nativeElement.click();
    }
  }

  agregarHorario() {
    let ok = true;
    if (this.horarios.filter(horario => horario.dia == this.nuevoHorario.dia).length > 0) {
      this.errorHorarioMsg = "Ya hay un horario para este día.";
      this.displayErrorHorario.nativeElement.click();
    } else if (this.nuevoHorario.hora_fin == "" || this.nuevoHorario.hora_inicio == "") {
      this.errorHorarioMsg = "Debe indicar los horarios de inicio y fin.";
      this.displayErrorHorario.nativeElement.click();
    } else if (this.nuevoHorario.hora_fin <= this.nuevoHorario.hora_inicio) {
      this.errorHorarioMsg = "La hora de fin no puede ser mayor o igual a la hora de inicio";
      this.displayErrorHorario.nativeElement.click();
    }else {
      this.horarios.push(JSON.parse(JSON.stringify(this.nuevoHorario)));
      this.nuevoHorario = {
        dia: 2,
        hora_inicio: "",
        hora_fin: ""
      };
    }
  }

  eliminarHorario(horariop) {
    this.horarios = this.horarios.filter(horario => horario != horariop);
  }

  handleResult(result: boolean, msg: string, action: number, resultData: number) {
    switch(action) {
      case this.FINALIZAR_CURSO: {
        this.dismissConfirm.nativeElement.click();
        if (result) {
          this.gcService.cursoEspecifico.isActivo = false;
        }
      }
      case this.EDITAR_CURSO: {
        this.dismissAgregarCurso.nativeElement.click();
        if (result) {
          this.toast.success("Información actualizada.", "", {positionClass: "toast-top-center"});
          this.gcService.cargarCurso(this.gcService.cursoEspecifico.curso_id);
        } else {
          this.toast.error(msg, "", {positionClass: "toast-top-center"});
        }
      }
    }
  }
}
