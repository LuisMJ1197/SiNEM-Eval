import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Curso, Estudiante, RegistroDeAsistencia } from '../graphql/models';
import { FinalizarCurso, ObtenerCursosDeProfesor, ObtenerEstudiantesPorCurso, ObtenerInfoRegistroDeAsistencia, ObtenerRegistrosDeAsistenciaPorCurso } from '../graphql/queries';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  misCursos: Curso[] = [];
  miCurso: Curso = {
    curso_id: 0,
    tipo_curso: {
      tipo_id: 0,
      tipo_name: ""
    },
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
  registrosDeAsistencia: RegistroDeAsistencia[] = [];
  registroDeAsistencia: RegistroDeAsistencia = {
    curso_id: 0,
    numero_registro: 0,
    fecha: "",
    estado_por_estudiante: []
  };

  constructor(private apollo: Apollo, private authService: AuthService) {
    this.cargarCursosDeProfesor();
  }

  cargarCursosDeProfesor() {
    this.apollo.query({
      query: ObtenerCursosDeProfesor,
      variables: {
        profesor_id: this.authService.currentUserValue.user.usuario_id
      }
    }).subscribe(({data}) => {
      if (data != null && data['obtenerCursosDeProfesor'] != null) {
        this.misCursos = data['obtenerCursosDeProfesor'];
      } else {
        this.misCursos = [];
      }
    });
  }

  cargarCurso(curso_id: number) {
    this.apollo.query({
      query: ObtenerCursosDeProfesor,
      variables: {
        profesor_id: this.authService.currentUserValue.user.usuario_id
      }
    }).subscribe(({data}) => {
      if (data != null && data['obtenerCursosDeProfesor'] != null) {
        this.misCursos = data['obtenerCursosDeProfesor'] as Curso[];
        this.misCursos.forEach(curso => {
          if (curso.curso_id == curso_id) {
            this.miCurso = curso;
          }
        })
      } else {
        this.misCursos = [];
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
        this.listaEstudiantes = data['obtenerEstudiantesPorCurso'] as Estudiante[];
      } else {
        this.listaEstudiantes = [];
      }
    });
  }

  cargarRegistrosDeAsistencia(curso_id: number) {
    this.apollo.query({
      query: ObtenerRegistrosDeAsistenciaPorCurso,
      variables: {
        curso_id: curso_id 
      }
    }).subscribe(({data}) => {
      if (data != null && data['obtenerRegistrosDeAsistenciaPorCurso'] != null) {
        this.registrosDeAsistencia = data['obtenerRegistrosDeAsistenciaPorCurso'] as RegistroDeAsistencia[];
      } else {
        this.registrosDeAsistencia = [];
      }
    });
  }

  cargarInfoRegistroDeAsistencia(curso_id: number, numero_registro: number) {
    this.apollo.query({
      query: ObtenerRegistrosDeAsistenciaPorCurso,
      variables: {
        curso_id: curso_id 
      }
    }).subscribe(({data}) => {
      if (data != null && data['obtenerRegistrosDeAsistenciaPorCurso'] != null) {
        this.registrosDeAsistencia = data['obtenerRegistrosDeAsistenciaPorCurso'] as RegistroDeAsistencia[];
        this.registrosDeAsistencia.forEach(registro => {
          if (registro.curso_id == curso_id && registro.numero_registro == numero_registro) {
            this.registroDeAsistencia = JSON.parse(JSON.stringify(registro));
          }
        });
      } else {
        this.registrosDeAsistencia = [];
      }
    });
    /* this.apollo.query({
      query: ObtenerInfoRegistroDeAsistencia,
      variables: {
        curso_id: curso_id,
        numero_registro: numero_registro
      }
    }).subscribe(({data}) => {
      if (data != null && data['obtenerInfoRegistroDeAsistencia'] != null) {
        this.registroDeAsistencia = data['obtenerInfoRegistroDeAsistencia'] as RegistroDeAsistencia;
      } else {
        this.registroDeAsistencia = {
          curso_id: 0,
          numero_registro: 0,
          fecha: "",
          estado_por_estudiante: []
        };
      }
    });*/
  }

  finalizarCurso(curso_id: number) {
    return this.apollo.query({
      query: FinalizarCurso,
      variables: {
        curso_id: curso_id 
      }
    });
  }
}
