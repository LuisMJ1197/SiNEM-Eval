import { Component, OnInit, ViewChild } from '@angular/core';
import { Estudiante, EstudianteInput } from 'src/app/graphql/models';
import { AuthService } from 'src/app/services/auth.service';
import { StudentsService } from 'src/app/services/students.service';

@Component({
  selector: 'app-gestion-estudiantes',
  templateUrl: './gestion-estudiantes.component.html',
  styleUrls: ['./gestion-estudiantes.component.scss']
})
export class GestionEstudiantesComponent implements OnInit {
  @ViewChild ('dissmissAddBtn', {static: true}) public dissmissAddBtn: any;

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

  constructor(public eService: StudentsService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  filtrarTodos() {
    this.eService.estudiantes_filtrados = JSON.parse(JSON.stringify(this.eService.estudiantes));
  }

  agregarEstudiante() {
    if (this.eService.estudiantes.filter(estudiante => estudiante.cedula.toLowerCase() == this.estudiante_nuevo.cedula.toLowerCase()).length > 0) {
      this.cedula_repeated = "Ya hay un usuario registrado con este número de cédula."
    } else {
      this.estudiante_nuevo.cedula = this.estudiante_nuevo.cedula.toLowerCase();
      this.eService.agregarEstudiante(this.estudiante_nuevo, this);
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
    } else {
      alert(msg);
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
    this.eService.editarEstudiante(this.estudiante_edit, this);
  }

  terminarEditarEstudiante(result: boolean, msg: string) {
    if (result) {
      this.eService.cargarEstudiantes();
    } else {
      alert(msg);
    }
  }
}
