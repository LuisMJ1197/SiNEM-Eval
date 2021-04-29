import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Curso, Estudiante, RegistroDeAsistencia } from '../graphql/models';
import { AgregarCurso, AgregarEstudiantesACurso, FinalizarCurso, ObtenerCursos, ObtenerEstudiantes, ObtenerEstudiantesPorCurso } from '../graphql/queries';
import { GestionCursoEspecificoComponent } from '../pages/gestion-curso-especifico/gestion-curso-especifico.component';
import { GestionCursosComponent } from '../pages/gestion-cursos/gestion-cursos.component';

@Injectable({
  providedIn: 'root'
})
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

  constructor(private apollo: Apollo) { 
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
        this.cursos = [];
      }
    });
  }

  cargarCurso(curso_id: number){
    this.apollo.query({
      query: ObtenerCursos,
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
        this.cursos = [];
      }
    });
  }

  cargarTodosLosEstudiantes() {
    this.apollo.query({
      query: ObtenerEstudiantes,
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => {
      if (data != null && data['obtenerEstudiantes'] != null) {
        this.todosEstudiantes = JSON.parse(JSON.stringify(data['obtenerEstudiantes'])) as Estudiante[];
      } else {
        this.todosEstudiantes = [];
      }
    });
  }

  cargarListaDeEstudiantes(curso_id: number) {
    this.apollo.query({
      query: ObtenerEstudiantesPorCurso,
      variables: {
        curso_id: curso_id 
      }
    }).subscribe(({data}) => {
      if (data != null && data['obtenerEstudiantesPorCurso'] != null) {
        this.listaEstudiantes = JSON.parse(JSON.stringify(data['obtenerEstudiantesPorCurso'])) as Estudiante[];
      } else {
        this.listaEstudiantes = [];
      }
    });
  }

  finalizarCurso(curso_id: number) {
    return this.apollo.query({
      query: FinalizarCurso,
      variables: {
        curso_id: curso_id 
      }
    });
  }

  agregarCurso(curso, caller: GestionCursosComponent) {
    this.apollo.mutate({
      mutation: AgregarCurso,
      variables: {
        curso: curso
      }
    }).subscribe(({data}) => {
      if (data != null && data['agregarCurso'] != null) {
        if(data['agregarCurso'].status == "ok") {
          caller.finalizarAgregarCurso(true, "");
        } else {
          caller.finalizarAgregarCurso(false, "Ha ocurrido un error.");
        }
      } else {
        caller.finalizarAgregarCurso(false, "Ha ocurrido un error.");
      }
    });
  }

  agregarEstudiantesACuros(estudiantes_agregar: any[], caller: GestionCursoEspecificoComponent) {
    this.apollo.mutate({
      mutation: AgregarEstudiantesACurso,
      variables: {
        estudiantes: estudiantes_agregar
      }
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
    });
  }
}
