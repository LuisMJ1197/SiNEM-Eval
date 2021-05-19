import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Dominio, meses, Rubro } from 'src/app/graphql/models';
import { ResultListener } from 'src/app/interfaces/result-listener';
import { ProfesorService } from 'src/app/services/profesor.service';

@Component({
  selector: 'app-matriz-evaluacion',
  templateUrl: './matriz-evaluacion.component.html',
  styleUrls: ['./matriz-evaluacion.component.scss']
})
export class MatrizEvaluacionComponent implements OnInit, ResultListener {
  GUARDAR_NOTA_RUBRO = 0;

  meses = meses;
  PORTAFOLIO = 2;
  PRUEBA_PARCIAL_C = 3;
  PRUEBA_FINAL_C = 4;
  TAREAS = 5;
  PRUEBA_PARCIAL_P = 6;
  PRUEBA_FINAL_P = 7;
  PRACTICAS = 8;

  domC_expanded: boolean = false;
  domP_expanded: boolean = false;
  showing_fsttable: boolean = true;

  constructor(private router: Router, public pService: ProfesorService, private toast: ToastrService) {
  }

  ngOnInit(): void {
    if (this.pService.miCurso.curso_id == 0) {
      let url = this.router.url.split("/");
      let urlStr = url[url.length - 2];
      url = urlStr.split("-");
      this.pService.cargarCurso(Number(url[0]));
      this.pService.cargarEvaluacionDeCurso(Number(url[0]));
    } else {
      this.pService.cargarEvaluacionDeCurso(this.pService.miCurso.curso_id);
    }
  }

  getValorDominio(dominio_id: number) {
    return this.getDominio(dominio_id).valor * ((this.pService.miCurso.valor_general) / 100);
  }

  getDominio(dominio_id: number):Dominio {
    let res: any[] = this.pService.rubricaCurso.dominios.filter(dominio => dominio.dominio_id == dominio_id);
    return res.length > 0 ? res[0] : null;
  }
  
  getDominioSocioafectivo(): Dominio {
    return this.getDominio(1);
  }

  getDominioCognitivo(): Dominio {
    return this.getDominio(2);
  }

  getDominioPsicomotor(): Dominio {
    return this.getDominio(3);
  }

  getRubro(dominio: Dominio, rubro_id: number): Rubro {
    let res: any[] = dominio.rubros.filter(rubro => rubro_id == rubro.rubro_id);
    return res.length > 0 ? res[0] : null;
  }

  calculateGrade(grade, value){
    return Number(Number((Number(grade) * (Number(value) / 100))).toFixed(2));
  }

  calcularSubtotalCognitivo(std) {    
    return Number(Number(this.calculateGrade(std.dominioCognitivo.portafolio.nota, this.getRubro(this.getDominioCognitivo(), this.PORTAFOLIO).valor)
      + this.calcularTotalRubro(this.getDominioCognitivo(), this.PRUEBA_PARCIAL_C, std.dominioCognitivo.prueba_parcial)
      + this.calculateGrade(std.dominioCognitivo.prueba_final.nota, this.getRubro(this.getDominioCognitivo(), this.PRUEBA_FINAL_C).valor)).toFixed(2))
  }

  calcularSubtotalPsicomotor(std) {
    return Number(Number(this.calcularTotalRubro(this.getDominioPsicomotor(), this.TAREAS, std.dominioPsicomotor.tareas)
      + this.calcularTotalRubro(this.getDominioPsicomotor(), this.PRACTICAS, std.dominioPsicomotor.practicas)
      + this.calcularTotalRubro(this.getDominioPsicomotor(), this.PRUEBA_PARCIAL_P, std.dominioPsicomotor.prueba_parcial)
      + this.calculateGrade(std.dominioPsicomotor.prueba_final.nota, this.getRubro(this.getDominioPsicomotor(), this.PRUEBA_FINAL_P).valor)).toFixed(2))
  }

  calcularSubtotal(asignaciones, valor) {
    let value = 0;
    // calcular asignaciones por valor;
    return Number(Number(value).toFixed(2));
  }

  calcularTotal(std) {
    return this.calculateGrade(std.dominioSocioafectivo.nota, this.getDominioSocioafectivo().valor) +
      this.calcularSubtotalCognitivo(std) + this.calcularSubtotalPsicomotor(std);
  }

  validateGrade(obj) {
    if (Number(obj.nota) > 100) {
      obj.nota = 100;
    }
    if (obj.nota == "") {
      obj.nota = 0;
    }
  }

  guardarNotaRubro(std, rubro: Rubro, nota: number) {
    this.pService.guardarNotaRubro(std.estudiante_id, this.pService.miCurso.curso_id, rubro.rubro_id, nota, this, this.GUARDAR_NOTA_RUBRO);
  }

  redondear(num) {
    return Number(Number(num).toFixed(2));
  }

  calcularTotalRubro(dominio, rubro_id: number, rubro) {
    let total = 0;
    let index = 0;
    rubro.forEach(asignacion => {
      total += this.calculateGrade(asignacion.nota, this.getRubro(dominio, rubro_id).asignaciones[index].valor);
      index += 1;
    });
    return Number(Number(total).toFixed(2));
  }

  goRubro(rubro) {
    if (rubro == this.PRUEBA_PARCIAL_C) {
      this.pService.rubroActual = this.getRubro(this.getDominioCognitivo(), rubro);
      this.router.navigate([this.router.url + "/" + 'prueba-parcial-cognitivo']);
    } else if (rubro == this.PRUEBA_PARCIAL_P) {
      this.pService.rubroActual = this.getRubro(this.getDominioPsicomotor(), rubro);
      this.router.navigate([this.router.url + "/" + 'prueba-parcial-psicomotor']);
    } else if (rubro == this.TAREAS) {
      this.pService.rubroActual = this.getRubro(this.getDominioPsicomotor(), rubro);
      this.router.navigate([this.router.url + "/" + 'tareas-psicomotor']);
    } else if (rubro == this.PRACTICAS) {
      this.pService.rubroActual = this.getRubro(this.getDominioPsicomotor(), rubro);
      this.router.navigate([this.router.url + "/" + 'practicas-psicomotor']);
    } 
  }

  sortByName(lista) {
    return lista.sort((a, b) => {
      let nombreA = a.estudiante_nombre;
      let nombreB = a.estudiante_nombre;
      return nombreA > nombreB ? 1 : nombreA === nombreB ? 0 : -1;
    });
  }

  
  handleResult(result: boolean, msg: string, action: number, resultData: number) {
    switch(action) {
      case this.GUARDAR_NOTA_RUBRO: {
        if (!result) {
          this.toast.error("Hubo un error al guardar la información.", "" , {positionClass: "toast-top-center"});
        }
        break;
      }
    }
  }
}
