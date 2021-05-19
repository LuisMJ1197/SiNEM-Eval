import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { tipos, tiposEstilos, meses, diasSemana} from 'src/app/graphql/models';
import { ResultListener } from 'src/app/interfaces/result-listener';
import { GestionCursosService } from 'src/app/services/gestion-cursos.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gestion-cursos',
  templateUrl: './gestion-cursos.component.html',
  styleUrls: ['./gestion-cursos.component.scss']
})
export class GestionCursosComponent implements OnInit, ResultListener {
  @ViewChild("displayErrorHorario", {static: true}) private displayErrorHorario: any;
  @ViewChild("dismissAgregarCurso", {static: true}) private dismissAgregarCurso: any;
  tipos = tipos;

  tiposEstilos = tiposEstilos;

  meses = meses;
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
  tipo_selec = "Todos";

  constructor(private router: Router, public gcService: GestionCursosService, public uService: UtilsService) { }

  ngOnInit(): void {
    if (this.gcService.cursos == []) {
      this.gcService.cargarCursos();
    }
    if(this.uService.modalidades == []) {
      this.uService.obtenerModalidades();
    }
    if(this.uService.profesores == []) {
      this.uService.obtenerProfesores();
    }
  }

  modalidadInstrumento() {
    
  }

  getClass(tipo: string) {
    return this.tiposEstilos[tipo];
  }

  goCourse(curso) {
    this.gcService.cursoEspecifico = curso;
    this.router.navigate(["courses-management/"
    .concat(curso.curso_id, "-", (curso.tipo_curso.tipo_name as string).toLowerCase(), "-", meses[curso.mes_periodo - 1].toLowerCase(), curso.anno_periodo)]);
  }

  agregarCurso() {
    let curso = {
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
        this.gcService.agregarCurso(curso, this, 0)
      } else {
        this.errorHorarioMsg = "Debe seleccionar al menos un horario.";
        this.displayErrorHorario.nativeElement.click();
      }
    } else {
      this.errorHorarioMsg = "Debe seleccionar un período.";
      this.displayErrorHorario.nativeElement.click();
    }
  }

  finalizarAgregarCurso(result: boolean, msg: string) {
    if (result) {
      this.gcService.cargarCursos();
      this.dismissAgregarCurso.nativeElement.click();
    } else {
      this.errorHorarioMsg = msg;
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
      case 0: {
        if (result) {
          this.dismissAgregarCurso.nativeElement.click();
        }
      }
    }
  }

  filtrarTodos() {
    this.gcService.cursos_filtrados = JSON.parse(JSON.stringify(this.gcService.cursos));
  }

  filtrarPorTipo(tipo) {
    if (tipo == "Todos") {
      this.filtrarTodos();
    } else {
      this.gcService.cursos_filtrados = this.gcService.cursos.filter(curso => curso.tipo_curso.tipo_name == tipo);
    }
  }
}
