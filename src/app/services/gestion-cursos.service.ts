import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { Curso, Estudiante, RegistroDeAsistencia } from '../graphql/models';
import { AgregarCurso, AgregarEstudiantesACurso, DarDeBaja, EditarCurso, FinalizarCurso, ObtenerCursos, ObtenerEstudiantes, ObtenerEstudiantesPorCurso } from '../graphql/queries';
import { ResultListener } from '../interfaces/result-listener';
import { GestionCursoEspecificoComponent } from '../pages/gestion-curso-especifico/gestion-curso-especifico.component';
import { GestionCursosComponent } from '../pages/gestion-cursos/gestion-cursos.component';

@Injectable({
  providedIn: 'root'
})

/**
 * Se encarga de la gestión de los cursos y la comunicación con la API.
 */
export class GestionCursosService {
  cursos: Curso[] = [];
  cursoEspecifico: Curso = {
    curso_id: 0,
    tipo_curso: {
      tipo_id: 0,
      tipo_name: ""
    },
    valor_general: 0,
    sede: {
      sede_id: 0,
      sede_name: ""
    },
    rubrica_id: 0,
    isActivo: true,
    anno_periodo: "",
    mes_periodo: 1,
    profesor_asignado: {
      profesor_id: 0,
      profesor_name: ""
    },
    horario: [],
    modalidad: {
      curso_id: 0,
      modalidad_id: 0,
      modalidad_name: "",
      categoria_instrumento: "",
      instrumento_name: ""
    }
  };
  listaEstudiantes: Estudiante[] = [];

  todosEstudiantes: Estudiante[] = [];
  todosEstudiantesFiltered: Estudiante[] = [];

  constructor(private apollo: Apollo, private toast: ToastrService) { 
    this.cargarCursos();
  }

  cargarCursos() {
    this.apollo.query({
      query: ObtenerCursos,
      fetchPolicy: "network-only"
    }).subscribe(({data}) => {
      if (data != null && data['obtenerCursos'] != null) {
        this.cursos = data['obtenerCursos'];
      } else {
        this.toast.error("Hubo un error al cargar la información de los cursos. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.cursos = [];
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }

  cargarCurso(curso_id: number){
    this.apollo.query({
      query: ObtenerCursos,
      fetchPolicy: "network-only"
    }).subscribe(({data}) => {
      if (data != null && data['obtenerCursos'] != null) {
        this.cursos = JSON.parse(JSON.stringify(data['obtenerCursos']));
        this.cursos.forEach(curso => {
          if (curso.curso_id == curso_id) {
            this.cursoEspecifico = curso;
            this.cargarTodosLosEstudiantes();
            this.cargarListaDeEstudiantes(curso_id);
          }
        });
      } else {
        this.toast.error("Hubo un error al cargar la información del curso. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.cursos = [];
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }

  cargarTodosLosEstudiantes() {
    this.apollo.query({
      query: ObtenerEstudiantes,
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => {
      if (data != null && data['obtenerEstudiantes'] != null) {
        this.todosEstudiantes = JSON.parse(JSON.stringify(data['obtenerEstudiantes'])) as Estudiante[];
        this.todosEstudiantesFiltered = JSON.parse(JSON.stringify(data['obtenerEstudiantes'])) as Estudiante[];
      } else {
        this.toast.error("Hubo un error al cargar la lista de estudiantes. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.todosEstudiantes = [];
        this.todosEstudiantesFiltered = [];
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }

  cargarListaDeEstudiantes(curso_id: number) {
    this.apollo.query({
      query: ObtenerEstudiantesPorCurso,
      variables: {
        curso_id: curso_id 
      },
      fetchPolicy: "network-only"
    }).subscribe(({data}) => {
      if (data != null && data['obtenerEstudiantesPorCurso'] != null) {
        this.listaEstudiantes = JSON.parse(JSON.stringify(data['obtenerEstudiantesPorCurso'])) as Estudiante[];
      } else {
        this.toast.error("Hubo un error al cargar la lista de estudiantes del curso. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.listaEstudiantes = [];
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }

  finalizarCurso(curso_id: number, action: number, listener: ResultListener) {
    this.apollo.mutate({
      mutation: FinalizarCurso,
      variables: {
        curso_id: curso_id 
      },
      fetchPolicy: "no-cache"
    }).subscribe(({data}) => {
      if (data != null && data['finalizarCurso'] != null) {
        if (data['finalizarCurso'].status == "ok") {
          listener.handleResult(true, "", action, 0);
        } else {
          this.toast.error("Ha ocurrido un error", "", {positionClass: "toast-top-center"});  
        }
      } else {
        this.toast.error("Ha ocurrido un error", "", {positionClass: "toast-top-center"});
      }
    });
  }

  agregarCurso(curso, listener: ResultListener, action: number) {
    this.apollo.mutate({
      mutation: AgregarCurso,
      variables: {
        curso: curso
      },
      fetchPolicy: "no-cache"
    }).subscribe(({data}) => {
      if (data != null && data['agregarCurso'] != null) {
        if(data['agregarCurso'].status == "ok") {
          listener.handleResult(true, "", action, -1);
        } else {
          this.toast.error("Ha ocurrido un error", "", {positionClass: "toast-top-center"});  
        }
      } else {
        this.toast.error("Ha ocurrido un error", "", {positionClass: "toast-top-center"});  
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }

  editarCurso(curso, listener: ResultListener, action: number) {
    this.apollo.mutate({
      mutation: EditarCurso,
      variables: {
        curso: curso
      },
      fetchPolicy: "no-cache"
    }).subscribe(({data}) => {
      if (data != null && data['editarCurso'] != null) {
        if(data['editarCurso'].status == "ok") {
          listener.handleResult(true, "", action, -1);
        } else {
          this.toast.error("Ha ocurrido un error", "", {positionClass: "toast-top-center"});  
        }
      } else {
        this.toast.error("Ha ocurrido un error", "", {positionClass: "toast-top-center"});  
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }

  agregarEstudiantesACuros(estudiantes_agregar: any[], caller: GestionCursoEspecificoComponent) {
    this.apollo.mutate({
      mutation: AgregarEstudiantesACurso,
      variables: {
        estudiantes: estudiantes_agregar
      },
      fetchPolicy: "no-cache"
    }).subscribe(({data}) => {
      if (data != null && data['agregarEstudiantesACurso'] != null) {
        if(data['agregarEstudiantesACurso'].status == "ok") {
          caller.terminarAgregarEstudiantesACurso(true, "");
        } else {
          caller.terminarAgregarEstudiantesACurso(false, "Ha ocurrido un error.");
        }
      } else {
        caller.terminarAgregarEstudiantesACurso(false, "Ha ocurrido un error.");
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }

  darDeBaja(estudiante_id: number, curso_id: number, caller: GestionCursoEspecificoComponent) {
    this.apollo.mutate({
      mutation: DarDeBaja,
      variables: {
        estudiante_id: estudiante_id,
        curso_id: curso_id
      },
      fetchPolicy: "no-cache"
    }).subscribe(({data}) => {
      if (data != null && data['darDeBaja'] != null) {
        if(data['darDeBaja'].status == "ok") {
          caller.terminarDarDebaja(true, "");
        } else {
          caller.terminarDarDebaja(false, "Ha ocurrido un error.");
        }
      } else {
        caller.terminarDarDebaja(false, "Ha ocurrido un error.");
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }
}
