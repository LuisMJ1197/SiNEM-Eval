import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curso, meses } from 'src/app/graphql/models';
import { ProfesorService } from 'src/app/services/profesor.service';

@Component({
  selector: 'app-mis-cursos',
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.scss']
})

export class MisCursosComponent implements OnInit {
  tipos = {
    negra: "Negra",
    blanca: "Blanca",
    corchea: "Corchea",
    semicorchea: "Semicorchea",
    redonda: "Redonda",
    egresado: "Egresado"
  };

  tiposEstilos = {
    Negra: "flaticon-negra",
    Blanca: "flaticon-blanca",
    Semicorchea: "flaticon-semicorchea",
    Corchea: "flaticon-nota-musical",
    Redonda: "flaticon-semibreve",
    Egresado: "flaticon-mortarboard"
  };
  tipo_selec: string = "Todos";

  meses = meses;

  constructor(private router: Router, public pService: ProfesorService) { }

  ngOnInit(): void {
    if (this.pService.misCursos == []) {
      this.pService.cargarCursosDeProfesor();
    }
  }

  getClass(tipo: string) {
    return this.tiposEstilos[tipo];
  }

  goCourse(curso) {
    this.pService.miCurso = curso;
    this.router.navigate(["my-courses/"
      .concat(curso.curso_id, "-", (curso.tipo_curso.tipo_name as string).toLowerCase(), "-", meses[curso.mes_periodo - 1].toLowerCase(), curso.anno_periodo)]);
  }

  filtrarTodos() {
    this.pService.cursos_filtrados = JSON.parse(JSON.stringify(this.pService.misCursos));
  }

  filtrarPorTipo(tipo) {
    if (tipo == "Todos") {
      this.filtrarTodos();
    } else {
      this.pService.cursos_filtrados = this.pService.misCursos.filter(curso => curso.tipo_curso.tipo_name == tipo);
    }
  }

}
