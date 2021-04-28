import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { meses } from 'src/app/graphql/models';
import { AgregarAsignacionARubro, EliminarAsignaciones, ModificarValorDeAsignaciones } from 'src/app/graphql/queries';
import { ResultHandler } from 'src/app/interfaces/result-handler';
import { ProfesorService } from 'src/app/services/profesor.service';

@Component({
  selector: 'app-matriz-evaluacion-rubro',
  templateUrl: './matriz-evaluacion-rubro.component.html',
  styleUrls: ['./matriz-evaluacion-rubro.component.scss']
})
export class MatrizEvaluacionRubroComponent implements OnInit, ResultHandler {
  GUARDAR_DISTRIBUCION = 0;
  AGREGAR_ASIGNACION = 1;
  GUARDAR_NOTA_ASIGNACION = 2;

  @ViewChild('guardar_distribucion', {static: true}) public guardar_distribucion: any;

  meses = meses;
  toDeleteAsig = null;
  toDelete: any[] = [];
  distribucionErr = "";
  asignaciones = [];
  nuevaAsig = "";

  constructor(private router: Router, private apollo: Apollo, public pService: ProfesorService) {
    
  }

  ngOnInit(): void {
    if (this.pService.miCurso.curso_id == 0) {
      let url = this.router.url.split("/");
      let urlStr = url[url.length - 3];
      let url2 = urlStr.split("-");
      this.pService.cargarCurso(Number(url2[0]));
      let rubro_id = this.getRubroID(url[url.length - 1]);
      this.pService.cargarEvaluacionDeRubro(Number(url2[0]), rubro_id);
    } else {
      // this.pService.cargarEvaluacionDeRubro(this.pService.miCurso.curso_id, this.pService.rubroActual.rubro_id);
    }
  }

  getRubroID(rubro_url) {
    if (rubro_url == "tareas-psicomotor") {
      return 5;
    } else if (rubro_url == "practicas-psicomotor") {
      return 8;
    } else if (rubro_url == "prueba-parcial-cognitivo") {
      return 3;
    } else if (rubro_url == "prueba-parcial-psicomotor") {
      return 6;
    }
  }

  buscarValor(nombre) {
    this.pService.rubroActual.asignaciones.forEach(element => {
      if (element.nombre == nombre) {
        return element.valor;
      }
    })
  }

  agregarAsignacion() {
    this.pService.agregarAsignacion({
      curso_id: this.pService.miCurso.curso_id,
      rubro_id: this.pService.rubroActual.rubro_id,
      nombre_asignacion: this.nuevaAsig
    }, this, this.AGREGAR_ASIGNACION);
  }

  modificarDistribucion() {
    this.asignaciones = JSON.parse(JSON.stringify(this.pService.rubroActual.asignaciones));
  }

  calculateGrade(grade, value){
    return Number(Number((Number(grade) * (Number(value) / 100))).toFixed(2));
  }

  calcularTotalRubro(std) {
    let total = 0;
    let index = 0;
    this.getRubroInfo(std).forEach(asignacion => {
      total += this.calculateGrade(asignacion.nota, this.pService.rubroActual.asignaciones[index].valor);
      index += 1;
    });
    return Number(Number(total).toFixed(2));
  }

  getRubroInfo(std) {
    if (this.pService.rubroActual.rubro_id == 5) {
      return std.dominioPsicomotor.tareas;
    } else if (this.pService.rubroActual.rubro_id == 8) {
      return std.dominioPsicomotor.practicas;
    } else if (this.pService.rubroActual.rubro_id == 3) {
      return std.dominioCognitivo.prueba_parcial;
    } else if (this.pService.rubroActual.rubro_id == 6) {
      return std.dominioPsicomotor.prueba_parcial;
    }
    return null;
  }

  eliminarAsignacion(asig) {
    this.asignaciones = this.asignaciones.filter(asign => asign != asig);
    this.toDelete.push(asig);
  }

  guardarDistribucion() {
    if (this.validarDistribucion()) {
      this.guardar_distribucion.nativeElement.click();
      let asignaciones = [];
      this.asignaciones.forEach(asig => {
        asignaciones.push({
          curso_id: this.pService.miCurso.curso_id,
          numero_asignacion: asig.numero_asignacion,
          valor: Number(asig.valor)
        });
      });

      let asignacionesToDelete = [];
      this.toDelete.forEach(asig => {
        asignacionesToDelete.push({
          curso_id: this.pService.miCurso.curso_id,
          numero_asignacion: asig.numero_asignacion,
          valor: Number(asig.valor)
        });
      });
      
      this.pService.guardarDistribucion(asignaciones, asignacionesToDelete, this, this.GUARDAR_DISTRIBUCION);
    } else {
      this.distribucionErr = "La distribución no cumple con el total del rubro."
    }
  }

  handleResult(result: boolean, msg: string, action: number, resultData: number) {
    switch(action) {
      case this.GUARDAR_DISTRIBUCION: {
        if (!result) {
          alert(msg);
        }
      }
      case this.AGREGAR_ASIGNACION: {
        if (!result) {
          alert(msg);
        }
      }
    }
  }

  validarDistribucion() {
    let total: number = 0;
    this.asignaciones.forEach(asig => {
      total += Number(asig.valor);
    });
    return total == this.pService.rubroActual.valor;
  }

  establecerDistribucionEquitativa() {
    let valor_n = this.redondear(this.pService.rubroActual.valor / this.asignaciones.length);
    this.asignaciones.forEach(asig => {
      asig.valor = valor_n;
    });
    if (valor_n * this.asignaciones.length != this.pService.rubroActual.valor) {
      this.asignaciones[0].valor += this.pService.rubroActual.valor - valor_n * this.asignaciones.length;
    }
  }

  redondear(num) {
    return Number(Number(num).toFixed(2));
  }

  validate() {
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.agregarAsignacion();
    }
    form.classList.add('was-validated');
  }

  dismissAdd() {
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    form.classList.remove('was-validated');
  }

  validateGrade(obj) {
    if (Number(obj.nota) > 100) {
      obj.nota = 100;
    }
    if (obj.nota == 0) {
      obj.nota = 0;
    }
  }

  guardarNotaAsignacion(std, numero_asignacion, nota) {
    this.pService.guardarNotaAsignacion(std.estudiante_id, this.pService.miCurso.curso_id, numero_asignacion, nota, this, this.GUARDAR_NOTA_ASIGNACION);
  }
}
