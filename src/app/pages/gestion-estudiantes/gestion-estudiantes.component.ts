import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Estudiante, EstudianteInput } from 'src/app/graphql/models';
import { ResultListener } from 'src/app/interfaces/result-listener';
import { AuthService } from 'src/app/services/auth.service';
import { StudentsService } from 'src/app/services/students.service';

@Component({
  selector: 'app-gestion-estudiantes',
  templateUrl: './gestion-estudiantes.component.html',
  styleUrls: ['./gestion-estudiantes.component.scss']
})
export class GestionEstudiantesComponent implements OnInit, ResultListener {
  @ViewChild ('dissmissAddBtn', {static: true}) public dissmissAddBtn: any;
  @ViewChild ('dissmissEditBtn', {static: true}) public dissmissEditBtn: any;
  private AGREGAR_ESTUDIANTE = 0;
  private EDITAR_ESTUDIANTE = 1;

  estudiante_nuevo: EstudianteInput = {
    sede_id: 1,
    cedula: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    telefono: "",
    nombre_encargado: ""
  };
  cedula_repeated = "";
  estudiante_edit: Estudiante = {
    sede: {
      sede_id: 1,
      sede_name: ""
    },
    estudiante_id: 0,
    cedula:"",
    nombre: "",
    apellido1: "",
    apellido2: "",
    telefono: "",
    nombre_encargado: ""
  };
  filtroNombre = "";

  constructor(public eService: StudentsService, private authService: AuthService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.eService.cargarEstudiantes();
  }

  filtrarTodos() {
    this.eService.estudiantes_filtrados = JSON.parse(JSON.stringify(this.eService.estudiantes));
  }

  agregarEstudiante() {
    if (this.eService.estudiantes.filter(estudiante => estudiante.cedula.toLowerCase() == this.estudiante_nuevo.cedula.toLowerCase()).length > 0) {
      this.cedula_repeated = "Ya hay un usuario registrado con este número de cédula."
    } else {
      this.estudiante_nuevo.cedula = this.estudiante_nuevo.cedula.toLowerCase();
      this.eService.agregarEstudiante(this.estudiante_nuevo, this.AGREGAR_ESTUDIANTE, this);
    } 
  }

  handleResult(result: boolean, msg: string, action: number, resultData: number) {
    switch(action) {
      case this.AGREGAR_ESTUDIANTE: {
        this.terminarAgregarEstudiante(result, msg);
      }
      case this.EDITAR_ESTUDIANTE: {
        this.terminarEditarEstudiante(result, msg)
      }
    }
  }

  terminarAgregarEstudiante(result: boolean, msg: string) {
    if (result) {
      this.estudiante_nuevo = {
        sede_id: 1,
        cedula: "",
        nombre: "",
        apellido1: "",
        apellido2: "",
        telefono: "",
        nombre_encargado: ""
      };
      this.cedula_repeated = "";
      this.dissmissAddBtn.nativeElement.click();
      this.eService.cargarEstudiantes();
      this.toast.success("Estudiante agregado exitosamente.", "", {positionClass: "toast-top-center"});
    } else {
      this.toast.error(msg, "", {positionClass: "toast-top-center"});
    }
  }

  validateAddForm() {
    var form = document.getElementById('addEstudianteForm') as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
    } else {
      form.classList.remove('was-validated');
      this.agregarEstudiante();
    }
  }

  dismissAddForm() {
    this.estudiante_nuevo = {
      sede_id: 1,
      nombre: "",
      cedula: "",
      apellido1: "",
      apellido2: "",
      telefono: "",
      nombre_encargado:""
    };
    var form = document.getElementById('addEstudianteForm') as HTMLFormElement;
    form.classList.remove('was-validated');
  }

  validateEditForm() {
    var form = document.getElementById('editEstudianteForm') as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
    } else {
      form.classList.remove('was-validated');
      this.editarEstudiante();
    }
  }

  dismissEditForm() {
    var form = document.getElementById('editEstudianteForm') as HTMLFormElement;
    form.classList.remove('was-validated');
  }

  editarEstudiante() {
    this.eService.editarEstudiante(this.estudiante_edit, this.EDITAR_ESTUDIANTE, this);
  }

  terminarEditarEstudiante(result: boolean, msg: string) {
    if (result) {
      this.eService.cargarEstudiantes();
      this.dissmissEditBtn.nativeElement.click();
      this.toast.success("Información actualizada.", "", {positionClass: "toast-top-center"});
    } else {
      this.toast.error(msg, "", {positionClass: "toast-top-center"});
    }
  }

  filtrarPorNombre(nombre) {
    this.eService.estudiantes_filtrados = this.eService.estudiantes.filter(est => est.nombre.concat(" ", est.apellido1, " ", est.apellido2).toLowerCase().includes(nombre.toLowerCase() || nombre == ""));
  }

  sortByName(lista) {
    return lista.sort((a, b) => {
      let nombreA = "".concat(" ", a.apellido1, " ", a.apellido2);
      let nombreB = "".concat(" ", b.apellido1, " ", b.apellido2);
      return nombreA > nombreB ? 1 : nombreA === nombreB ? 0 : -1;
    });
  }
}
