import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { Curso, Estudiante, RegistroDeAsistencia, Rubrica, Rubro } from '../graphql/models';
import { AgregarAsignacionARubro, AgregarRegistroDeNotaPorAsignacion, AgregarRegistroDeNotaPorRubro, EditarRegistroDeAsistencia, EliminarAsignaciones, EliminarRegistroDeAsistencia, FinalizarCurso, ModificarValorDeAsignaciones, ObtenerCursosDeProfesor, ObtenerEstudiantesPorCurso, ObtenerInfoRegistroDeAsistencia, ObtenerNotas, ObtenerRegistrosDeAsistenciaPorCurso, ObtenerRubrica } from '../graphql/queries';
import { ResultHandler } from '../interfaces/result-handler';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  misCursos: Curso[] = [];
  miCurso: Curso = {
    curso_id: 0,
    valor_general: 0,
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
  cursos_filtrados: Curso[] = [];
  listaEstudiantes: Estudiante[] = [];
  registrosDeAsistencia: RegistroDeAsistencia[] = [];
  registroDeAsistencia: RegistroDeAsistencia = {
    curso_id: 0,
    numero_registro: 0,
    fecha: "",
    estado_por_estudiante: []
  };
  registrosFiltrados: RegistroDeAsistencia[] = [];
  rubricaCurso: Rubrica = null;
  notasCurso: any = null;
  rubroActual: Rubro = null;

  constructor(private apollo: Apollo, private authService: AuthService, private toast: ToastrService) {
    this.cargarCursosDeProfesor();
  }

  cargarCursosDeProfesor() {
    this.apollo.query({
      query: ObtenerCursosDeProfesor,
      variables: {
        profesor_id: this.authService.currentUserValue.user.usuario_id
      },
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => {
      if (data != null && data['obtenerCursosDeProfesor'] != null) {
        this.misCursos = JSON.parse(JSON.stringify(data['obtenerCursosDeProfesor']));
        this.cursos_filtrados = JSON.parse(JSON.stringify(this.misCursos));
      } else {
        this.toast.error("Hubo un error al cargar la información de los cursos. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.misCursos = [];
        this.cursos_filtrados = [];
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
        this.misCursos = JSON.parse(JSON.stringify(data['obtenerCursosDeProfesor']));
        this.cursos_filtrados = JSON.parse(JSON.stringify(this.misCursos));
        this.misCursos.forEach(curso => {
          if (curso.curso_id == curso_id) {
            this.miCurso = curso;
          }
        })
      } else {
        this.toast.error("Hubo un error al cargar la información del curso. Recargue la página.", "" , {positionClass: "toast-top-center"});
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
        this.listaEstudiantes = JSON.parse(JSON.stringify(data['obtenerEstudiantesPorCurso'])) as Estudiante[];
      } else {
        this.toast.error("Hubo un error al cargar la lista de estudiantes. Recargue la página", "" , {positionClass: "toast-top-center"});
        this.listaEstudiantes = [];
      }
    });
  }

  cargarRegistrosDeAsistencia(curso_id: number) {
    this.apollo.query({
      query: ObtenerRegistrosDeAsistenciaPorCurso,
      variables: {
        curso_id: curso_id 
      },
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => {
      if (data != null && data['obtenerRegistrosDeAsistenciaPorCurso'] != null) {
        this.registrosDeAsistencia = data['obtenerRegistrosDeAsistenciaPorCurso'] as RegistroDeAsistencia[];
        this.registrosFiltrados = JSON.parse(JSON.stringify(this.registrosDeAsistencia));
      } else {
        this.toast.error("Hubo un error al cargar los registros de asistencia del curso. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.registrosDeAsistencia = [];
        this.registrosFiltrados = [];
      }
    });
  }

  cargarInfoRegistroDeAsistencia(curso_id: number, numero_registro: number) {
    this.apollo.query({
      query: ObtenerRegistrosDeAsistenciaPorCurso,
      variables: {
        curso_id: curso_id,
      },
      fetchPolicy: 'network-only'
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
        this.toast.error("Hubo un error al cargar la información del registro de asistencia. Recargue la página.", "" , {positionClass: "toast-top-center"});
      }
    });
  }

  finalizarCurso(curso_id: number) {
    return this.apollo.mutate({
      mutation: FinalizarCurso,
      variables: {
        curso_id: curso_id 
      }
    });
  }

  cargarEvaluacionDeCurso(curso_id: number) {
    this.apollo.query({
      query: ObtenerRubrica,
      variables: {
        curso_id: curso_id,
      },
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => {
      if (data != null && data['obtenerRubrica'] != null) {
        this.rubricaCurso = null;
        this.notasCurso = null;
        this.rubricaCurso = data['obtenerRubrica'];
        this.obtenerNotas(curso_id);
      } else {
        this.toast.error("Hubo un error al obtener la rúbrica del curso. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.rubricaCurso = null;
      }
    });
  }

  cargarEvaluacionDeRubro(curso_id: number, rubro_id: number) {
    this.apollo.query({
      query: ObtenerRubrica,
      variables: {
        curso_id: curso_id,
      },
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => {
      if (data != null && data['obtenerRubrica'] != null) {
        this.rubricaCurso = data['obtenerRubrica'];
        this.rubricaCurso.dominios.forEach(dominio => {
          this.obtenerNotas(curso_id);
          dominio.rubros.forEach(rubro => {
            if (rubro.rubro_id == rubro_id) {
              this.rubroActual = JSON.parse(JSON.stringify(rubro));
            }
          })
        });
      } else {
        this.toast.error("Hubo un error al obtener las notas del curso. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.rubricaCurso = null;
      }
    });
  }

  private obtenerNotas(curso_id: number) {
    this.apollo.query({
      query: ObtenerNotas,
      variables: {
        curso_id: curso_id,
      },
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => {
      if (data != null && data['obtenerNotas'] != null) {
        this.notasCurso = JSON.parse(JSON.stringify(data['obtenerNotas']));
      } else {
        this.toast.error("Hubo un error al obtener las notas del curso. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.notasCurso = null;
      }
    });
  }

  agregarAsignacion(asignacion, caller: ResultHandler, action: number) {
    this.apollo.mutate({
      mutation: AgregarAsignacionARubro,
      variables: {
        curso_id: asignacion.curso_id,
        rubro_id: asignacion.rubro_id,
        nombre_asignacion: asignacion.nuevaAsig
      }
    }).subscribe(({data}) => {
      if (data != null && data['agregarAsignacionARubro'] != null) {
        if (data['agregarAsignacionARubro'].status == "ok") {
          this.cargarEvaluacionDeRubro(this.miCurso.curso_id, this.rubroActual.rubro_id);
        } else {
          caller.handleResult(false, "Ha ocurrido un error.", action, -1);
        }
      } else {
        caller.handleResult(false, "Ha ocurrido un error.", action, -1);
      }
    });
  }

  public guardarDistribucion(asignaciones, asignacionesToDelete, caller: ResultHandler, action: number) {
    this.apollo.mutate({
      mutation: ModificarValorDeAsignaciones,
      variables: {
        asignaciones: asignaciones
      }
    }).subscribe(({data}) => {
      if (data != null && data['modificarValorDeAsignaciones'] != null) {
        if (data['modificarValorDeAsignaciones'].status == "ok") {
          this.deleteAsignaciones(asignacionesToDelete, caller, action);
        } else {
          caller.handleResult(false, "Ha ocurrido un error.", action, -1);
        }
      } else {
        caller.handleResult(false, "Ha ocurrido un error.", action, -1);
      }
    });
  }
  
  
  private deleteAsignaciones(asignacionesToDelete, caller, action) {
    this.apollo.mutate({
      mutation: EliminarAsignaciones,
      variables: {
        asignaciones: asignacionesToDelete
      }
    }).subscribe(({data}) => {
      if (data != null && data['eliminarAsignaciones'] != null) {
        if (data['eliminarAsignaciones'].status != "ok") {
          caller.handleResult(false, "Ha ocurrido un error.", action, -1);
        } else {
          this.cargarEvaluacionDeRubro(this.miCurso.curso_id, this.rubroActual.rubro_id);
        }
      } else {
        caller.handleResult(false, "Ha ocurrido un error.", action, -1);
      }
    });
  }

  guardarNotaAsignacion(estudiante_id, curso_id, numero_asignacion, nota, caller, action) {
    this.apollo.mutate({
      mutation: AgregarRegistroDeNotaPorAsignacion,
      variables: {
        registro: {
          curso_id: curso_id,
          numero_asignacion: numero_asignacion,
          nota: Number(nota),
          estudiante_id: estudiante_id
        }
      }
    }).subscribe(({data}) => {
      if (data != null && data['agregarRegistroDeNotaPorAsignacion'] != null) {
        if (data['agregarRegistroDeNotaPorAsignacion'].status != "ok") {
          caller.handleResult(false, "Ha ocurrido un error.", action, -1);
        }
      } else {
        caller.handleResult(false, "Ha ocurrido un error.", action, -1);
      }
    });
  }

  guardarNotaRubro(estudiante_id, curso_id, rubro_id, nota, caller: ResultHandler, action) {
    this.apollo.mutate({
      mutation: AgregarRegistroDeNotaPorRubro,
      variables: {
        registro: {
          curso_id: curso_id,
          rubro_id: rubro_id,
          nota: Number(nota),
          estudiante_id: estudiante_id
        }
      }
    }).subscribe(({data}) => {
      if (data != null && data['agregarRegistroDeNotaPorRubro'] != null) {
        if (data['agregarRegistroDeNotaPorRubro'].status != "ok") {
          caller.handleResult(false, "Ha ocurrido un error.", action, -1);
        }
      } else {
        caller.handleResult(false, "Ha ocurrido un error.", action, -1);
      }
    });
  }

  guardarCambiosRegistroDeAsistencia(registros_input: any[], caller: ResultHandler, action: number) {
    this.apollo.mutate({
      mutation: EditarRegistroDeAsistencia,
      variables: {
        registros: registros_input
      }
    }).subscribe(({data}) => {
      if (data != null && data['editarRegistroDeAsistencia'] != null) {
        if (data['editarRegistroDeAsistencia'].status == "error") {
          caller.handleResult(false, "Ha ocurrido un error.", action, null);
          // alert("Ha ocurrido un error" + data['editarRegistroDeAsistencia'].errorNumber);
        } else {
          caller.handleResult(true, "", action, null);
        }
      } else {
        caller.handleResult(false, "Ha ocurrido un error.", action, null);
      }
    });
  }
  
  eliminarRegistroDeAsistencia(caller: ResultHandler, action: number) {
    this.apollo.mutate({
      mutation: EliminarRegistroDeAsistencia,
      variables: {
        curso_id: this.registroDeAsistencia.curso_id,
        numero_registro: this.registroDeAsistencia.numero_registro
      }
    }).subscribe(({ data }) => {
      if (data != null && data['eliminarRegistroDeAsistencia'] != null) {
        if (data['eliminarRegistroDeAsistencia'].status == "error") {
          caller.handleResult(false, "Ha ocurrido un error.", action, null);
        } else {
          this.cargarRegistrosDeAsistencia(this.miCurso.curso_id);
          caller.handleResult(true, "", action, null);
        }
      } else {
        caller.handleResult(false, "Ha ocurrido un error.", action, null);
      }
    });
  }
}
