import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

class Expandable {
  public items = [];
  constructor() {
  }
}

class Rubrica extends Expandable {
  constructor() {
    super();
  }

  addDominio(dominio_nombre, dominio_valor) {
    this.items.push(new Dominio(dominio_nombre, dominio_valor));
  }
}

class Dominio extends Expandable {
  constructor(public dominio_nombre, public dominio_valor) {
    super();
  }

  addRubro(rubro_nombre, rubro_valor, is_expandable) {
    this.items.push(new Rubro(rubro_nombre, rubro_valor, is_expandable));
  }
}

class Rubro extends Expandable {
  constructor(public rubro_nombre, public rubro_valor, public is_expandable) {
    super();
  }

  addAsignacion(asignacion_nombre, asignacion_valor) {
    if (this.is_expandable) {
      this.items.push({asignacion_nombre: asignacion_nombre, asignacion_valor: asignacion_valor});
    }
  }
}

@Component({
  selector: 'app-matriz-evaluacion',
  templateUrl: './matriz-evaluacion.component.html',
  styleUrls: ['./matriz-evaluacion.component.scss']
})
export class MatrizEvaluacionComponent implements OnInit {
  domC_expanded: boolean = false;
  domP_expanded: boolean = false;
  showing_fsttable: boolean = true;
  valor_curso: number = 15;
  valor_dominio_socioafectivo = 10 * ((this.valor_curso / 100));
  valor_dominio_cognitivo = 30 * ((this.valor_curso / 100));
  valor_dominio_psicomotor = 60 * ((this.valor_curso / 100));

  rubrica = {
    dominioSocioafectivo: {
      valor: 10
    },
    dominioCognitivo: {
      valor: 30,
      rubros: {
        portfolio: {
          valor: 5
        },
        prueba_parcial: {
          valor: 10
        },
        prueba_final: {
          valor: 15
        }
      }
    },
    dominioPsicomotor: {
      valor: 60,
      rubros: {
        tareas: {
          valor: 5,
          asignaciones: [
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
        },
        practicas: {
          valor: 15,
          asignaciones: [
            {
              nombre: "Tarea 1",
              valor: 5
            },
            {
              nombre: "Tarea 2",
              valor: 5
            },
            {
              nombre: "Tarea 3",
              valor: 5
            }
          ]
        },
        prueba_parcial: {
          valor: 10
        },
        prueba_final: {
          valor: 30
        }
      }
    }
  }

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

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  calculateGrade(grade, value){
    return Number(Number((Number(grade) * (Number(value) / 100))).toFixed(2));
  }

  calcularSubtotalCognitivo(std) {
    return Number(Number(this.calculateGrade(std.dominioCognitivo.rubros.portfolio.nota, this.rubrica.dominioCognitivo.rubros.portfolio.valor)
      + this.calculateGrade(std.dominioCognitivo.rubros.prueba_parcial.nota, this.rubrica.dominioCognitivo.rubros.prueba_parcial.valor)
      + this.calculateGrade(std.dominioCognitivo.rubros.prueba_final.nota, this.rubrica.dominioCognitivo.rubros.prueba_final.valor)).toFixed(2))
  }

  calcularSubtotalPsicomotor(std) {
    return Number(Number(this.calcularTotalRubro(std, "tareas")
      + this.calcularTotalRubro(std, "practicas")
      + this.calculateGrade(std.dominioPsicomotor.rubros.prueba_parcial.nota, this.rubrica.dominioPsicomotor.rubros.prueba_parcial.valor)
      + this.calculateGrade(std.dominioPsicomotor.rubros.prueba_final.nota, this.rubrica.dominioPsicomotor.rubros.prueba_final.valor)).toFixed(2))
  }

  calcularSubtotal(asignaciones, valor) {
    let value = 0;
    // calcular asignaciones por valor;
    return Number(Number(value).toFixed(2));
  }

  calcularTotal(std) {
    return this.calculateGrade(std.dominioSocioafectivo.nota, this.rubrica.dominioSocioafectivo.valor) +
      this.calcularSubtotalCognitivo(std) + this.calcularSubtotalPsicomotor(std);
  }

  validateGrade(obj) {
    if (Number(obj.nota) > 100) {
      obj.nota = 100;
    }
  }

  redondear(num) {
    return Number(Number(num).toFixed(2));
  }

  calcularTotalRubro(std, nombreRubro) {
    let total = 0;
    let index = 0;
    std.dominioPsicomotor.rubros[nombreRubro.toLowerCase()].asignaciones.forEach(asignacion => {
      total += this.calculateGrade(asignacion.nota, this.rubrica.dominioPsicomotor.rubros[nombreRubro.toLowerCase()].asignaciones[index].valor);
      index += 1;
    });
    return Number(Number(total).toFixed(2));
  }

  goRubro(rubro) {
    this.router.navigate([this.router.url + "/tareas"]);
  }
}
