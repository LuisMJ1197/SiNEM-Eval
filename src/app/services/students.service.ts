import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Estudiante, EstudianteInput } from '../graphql/models';
import { RegistrarEstudiante, ObtenerEstudiantesPorCurso, EditarEstudiante, AgregarEstudianteACurso, ObtenerEstudiantes } from '../graphql/queries';
import { GestionEstudiantesComponent } from '../pages/gestion-estudiantes/gestion-estudiantes.component';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  estudiantes: Estudiante[] = [];
  estudiantes_filtrados: Estudiante[] = [];


  constructor(private apollo: Apollo) { }

  cargarEstudiantes() {
    this.apollo.query({
      query: ObtenerEstudiantes,
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => { 
      console.log(data)
      if (data != null && data['obtenerEstudiantes'] != null) {
        this.estudiantes = data['obtenerEstudiantes'];
        this.estudiantes_filtrados = JSON.parse(JSON.stringify(this.estudiantes));
      } else {
        this.estudiantes = [];
        this.estudiantes_filtrados = [];
      }
    });
  }


  agregarEstudiante(estudiante: EstudianteInput, caller: GestionEstudiantesComponent) {
    this.apollo.mutate({
      mutation: RegistrarEstudiante,
      variables: {
        usuario: estudiante
      }
    }).subscribe(({data}) => {
      if (data != null && data['registrarEstudiante'] != null) {
        if (data['registrarEstudiante'].status == "ok") {
          caller.terminarAgregarEstudiante(true, "");
        } else {
          caller.terminarAgregarEstudiante(false, "Ha ocurrido un error.");
        }
       } else {
        caller.terminarAgregarEstudiante(false, "Ha ocurrido un error.");
      }
    });
  }  

  editarEstudiante(estudiante: Estudiante, caller: GestionEstudiantesComponent) {
    this.apollo.mutate({
      mutation: EditarEstudiante,
      variables: {
        usuario: {
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          apellido1: estudiante.apellido1,
          apellido2: estudiante.apellido2,
          telefono: estudiante.telefono,
          nombreE: estudiante.nombre_encargado
        }
      }
    }).subscribe(({data}) => {
      if (data != null && data['editarEstudiante'] != null) {
        if (data['editarEstudiante'].status == "ok") {
          caller.terminarEditarEstudiante(true, "");
        } else {
          caller.terminarEditarEstudiante(false, "Ha ocurrido un error.");
        }
       } else {
        caller.terminarEditarEstudiante(false, "Ha ocurrido un error.");
      }
    });
  }
}
