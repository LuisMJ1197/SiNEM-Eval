import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { meses } from 'src/app/graphql/models';
import { ProfesorService } from 'src/app/services/profesor.service';

@Component({
  selector: 'app-lista-estudiantes',
  templateUrl: './lista-estudiantes.component.html',
  styleUrls: ['./lista-estudiantes.component.scss']
})
export class ListaEstudiantesComponent implements OnInit {
  meses = meses;

  constructor(private router: Router, public pService: ProfesorService) { }

  ngOnInit(): void {
    if (this.pService.miCurso.curso_id == 0) {
      let url = this.router.url.split("/");
      let urlStr = url[url.length - 2];
      url = urlStr.split("-");
      this.pService.cargarCurso(Number(url[0]));
      this.pService.cargarListaDeEstudiantes(Number(url[0]));
    } else {
      this.pService.cargarListaDeEstudiantes(this.pService.miCurso.curso_id);
    }
  }

  sortByName(lista) {
    return lista.sort((a, b) => {
      let nombreA = "".concat(" ", a.apellido1, " ", a.apellido2);
      let nombreB = "".concat(" ", b.apellido1, " ", b.apellido2);
      return nombreA > nombreB ? 1 : nombreA === nombreB ? 0 : -1;
    });
  }
}
