import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matriz-evaluacion',
  templateUrl: './matriz-evaluacion.component.html',
  styleUrls: ['./matriz-evaluacion.component.scss']
})
export class MatrizEvaluacionComponent implements OnInit {

  notas = [
    {
      estudiante_id: 1,
      estudiante: "Mauricio Murillo Brayley",
      total: 85,
      dominioSocioafectivo: {
        nota: 100,
        nota_porcent: 10
      },
      dominioCognitivo: {
        nota_porcent: 35.05,
        rubros: 
          {
            portfolio: {
              nota: 80,
              nota_porcent: 8
            },
            prueba_parcial: {
              nota: 70.5,
              nota_porcent: 7.05
            },
            prueba_final: {
              nota: 90,
              nota_porcent: 9
            }
          }
      },
      dominioPsicomotor: {
        nota_percent: 60,
        rubros:
          {
            tareas: {
              nota_porcent: 5,
              asignaciones: []
            },
            practicas: {
              nota_porcent: 15,
              asignaciones: []
            },
            prueba_parcial: {
              nota: 100,
              nota_porcent: 10
            },
            prueba_final: {
              nota: 100,
              nota_porcent: 10
            }
          }
      }
    },
    {
      estudiante_id: 2,
      estudiante: "Mauricio Murillo Brayley",
      total: 85,
      dominioSocioafectivo: {
        nota: 100,
        nota_porcent: 10
      },
      dominioCognitivo: {
        nota_porcent: 35.05,
        rubros: 
          {
            portfolio: {
              nota: 80,
              nota_porcent: 8
            },
            prueba_parcial: {
              nota: 70.5,
              nota_porcent: 7.05
            },
            prueba_final: {
              nota: 90,
              nota_porcent: 9
            }
          }
      },
      dominioPsicomotor: {
        nota_percent: 60,
        rubros:
          {
            tareas: {
              nota_porcent: 5,
              asignaciones: []
            },
            practicas: {
              nota_porcent: 15,
              asignaciones: []
            },
            prueba_parcial: {
              nota: 100,
              nota_porcent: 10
            },
            prueba_final: {
              nota: 100,
              nota_porcent: 10
            }
          }
      }
    },
    {
      estudiante_id: 3,
      estudiante: "Mauricio Murillo Brayley",
      total: 85,
      dominioSocioafectivo: {
        nota: 100,
        nota_porcent: 10
      },
      dominioCognitivo: {
        nota_porcent: 35.05,
        rubros: 
          {
            portfolio: {
              nota: 80,
              nota_porcent: 8
            },
            prueba_parcial: {
              nota: 70.5,
              nota_porcent: 7.05
            },
            prueba_final: {
              nota: 90,
              nota_porcent: 9
            }
          }
      },
      dominioPsicomotor: {
        nota_percent: 60,
        rubros:
          {
            tareas: {
              nota_porcent: 5,
              asignaciones: []
            },
            practicas: {
              nota_porcent: 15,
              asignaciones: []
            },
            prueba_parcial: {
              nota: 100,
              nota_porcent: 10
            },
            prueba_final: {
              nota: 100,
              nota_porcent: 10
            }
          }
      }
    },
    {
      estudiante_id: 4,
      estudiante: "Mauricio Murillo Brayley",
      total: 85,
      dominioSocioafectivo: {
        nota: 100,
        nota_porcent: 10
      },
      dominioCognitivo: {
        nota_porcent: 35.05,
        rubros: 
          {
            portfolio: {
              nota: 80,
              nota_porcent: 8
            },
            prueba_parcial: {
              nota: 70.5,
              nota_porcent: 7.05
            },
            prueba_final: {
              nota: 90,
              nota_porcent: 9
            }
          }
      },
      dominioPsicomotor: {
        nota_percent: 60,
        rubros:
          {
            tareas: {
              nota_porcent: 5,
              asignaciones: []
            },
            practicas: {
              nota_porcent: 15,
              asignaciones: []
            },
            prueba_parcial: {
              nota: 100,
              nota_porcent: 10
            },
            prueba_final: {
              nota: 100,
              nota_porcent: 10
            }
          }
      }
    },
    {
      estudiante_id: 5,
      estudiante: "Mauricio Murillo Brayley",
      total: 85,
      dominioSocioafectivo: {
        nota: 100,
        nota_porcent: 10
      },
      dominioCognitivo: {
        nota_porcent: 35.05,
        rubros: 
          {
            portfolio: {
              nota: 80,
              nota_porcent: 8
            },
            prueba_parcial: {
              nota: 70.5,
              nota_porcent: 7.05
            },
            prueba_final: {
              nota: 90,
              nota_porcent: 9
            }
          }
      },
      dominioPsicomotor: {
        nota_percent: 60,
        rubros:
          {
            tareas: {
              nota_porcent: 5,
              asignaciones: []
            },
            practicas: {
              nota_porcent: 15,
              asignaciones: []
            },
            prueba_parcial: {
              nota: 100,
              nota_porcent: 10
            },
            prueba_final: {
              nota: 100,
              nota_porcent: 10
            }
          }
      }
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
