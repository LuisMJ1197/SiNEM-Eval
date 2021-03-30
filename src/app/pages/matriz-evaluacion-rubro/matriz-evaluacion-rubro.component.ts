import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matriz-evaluacion-rubro',
  templateUrl: './matriz-evaluacion-rubro.component.html',
  styleUrls: ['./matriz-evaluacion-rubro.component.scss']
})
export class MatrizEvaluacionRubroComponent implements OnInit {

  nombreRubro: string = "Tareas";
  valorRubro = 5;
  asignacionesValor = [
    {
      nombre: "Tarea 1",
      valor: 2
    },
    {
      nombre: "Tarea 2",
      valor: 1.5
    },
    {
      nombre: "Tarea 3",
      valor: 1.5
    }
  ]

  notas = [
    {
      estudiante_id: 1,
      estudiante: "Mauricio Murillo Brayley",
      dominioSocioafectivo: {
        nota: 100,
      },
      dominioCognitivo: {
        rubros: 
          {
            portfolio: {
              nota: 80,
            },
            prueba_parcial: {
              nota: 70.5,
            },
            prueba_final: {
              nota: 90,
            }
          }
      },
      dominioPsicomotor: {
        nota_percent: 60,
        rubros:
          {
            tareas: {
              asignaciones: [
                {
                  nombre: "Tarea 1",
                  nota: 100
                },
                {
                  nombre: "Tarea 2",
                  nota: 100
                },
                {
                  nombre: "Tarea 3",
                  nota: 100
                }
              ]
            },
            practicas: {
              asignaciones: []
            },
            prueba_parcial: {
              nota: 100,
            },
            prueba_final: {
              nota: 100,
            }
          }
      }
    }
  ];

  constructor() {
    
   }

  ngOnInit(): void {
  }

  buscarValor(nombre) {
    this.asignacionesValor.forEach(element => {
      if (element.nombre == nombre) {
        return element.valor;
      }
    })
  }

  calculateGrade(grade, value){
    return Number(Number((Number(grade) * (Number(value) / 100))).toFixed(2));
  }

  calcularTotalRubro(std) {
    let total = 0;
    let index = 0;
    std.dominioPsicomotor.rubros[this.nombreRubro.toLowerCase()].asignaciones.forEach(asignacion => {
      total += this.calculateGrade(asignacion.nota, this.asignacionesValor[index].valor);
      index += 1;
    });
    return Number(Number(total).toFixed(2));
  }
}
