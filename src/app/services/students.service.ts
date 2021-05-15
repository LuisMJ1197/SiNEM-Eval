import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { Estudiante, EstudianteInput } from '../graphql/models';
import { RegistrarEstudiante, EditarEstudiante, ObtenerEstudiantes } from '../graphql/queries';
import { GestionEstudiantesComponent } from '../pages/gestion-estudiantes/gestion-estudiantes.component';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  estudiantes: Estudiante[] = [];
  estudiantes_filtrados: Estudiante[] = [];

  constructor(private apollo: Apollo, private toast: ToastrService) { }

  cargarEstudiantes() {
    this.apollo.query({
      query: ObtenerEstudiantes,
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => { 
      console.log(data)
      if (data != null && data['obtenerEstudiantes'] != null) {
        this.estudiantes = JSON.parse(JSON.stringify(data['obtenerEstudiantes']));
        this.estudiantes_filtrados = JSON.parse(JSON.stringify(this.estudiantes));
      } else {
        this.toast.error("Hubo un error al cargar la información de los estudiantes. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.estudiantes = [];
        this.estudiantes_filtrados = [];
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }


  agregarEstudiante(estudiante: EstudianteInput, caller: GestionEstudiantesComponent) {
    this.apollo.mutate({
      mutation: RegistrarEstudiante,
      variables: {
        estudiante: estudiante
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
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }  

  editarEstudiante(estudiante: Estudiante, caller: GestionEstudiantesComponent) {
    this.apollo.mutate({
      mutation: EditarEstudiante,
      variables: {
        estudiante: {
          estudiante_id: estudiante.estudiante_id,
          nombre: estudiante.nombre,
          apellido1: estudiante.apellido1,
          apellido2: estudiante.apellido2,
          telefono: estudiante.telefono,
          nombre_encargado: estudiante.nombre_encargado
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
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }
}
