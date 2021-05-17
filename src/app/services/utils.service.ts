import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Modalidad} from '../graphql/models';
import { ObtenerModalidades, ObtenerUsuarios } from '../graphql/queries';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  modalidades = [];
  profesores = [];
  categorias_instrumento = [];
  
  constructor(private apollo: Apollo) {
    this.obtenerModalidades();
    this.obtenerProfesores();
  }

  obtenerModalidades(){
    this.apollo.query({
      query: ObtenerModalidades
    }).subscribe(({data}) => {
      if (data != null && data['obtenerModalidades'] != null) {
        this.modalidades = data['obtenerModalidades'] as Modalidad[];
        this.modalidades.forEach(modalidad => {
          if (modalidad.modalidad_id == 2) {
            this.categorias_instrumento = modalidad.categorias_instrumento;
          }
        })
      } else {
        this.modalidades = [];
        this.categorias_instrumento = [];
      }
    });
  }

  obtenerProfesores(){
    this.apollo.query({
      query: ObtenerUsuarios,
      fetchPolicy: "network-only"
    }).subscribe(({data}) => {
      if (data != null && data['obtenerUsuarios'] != null) {
        this.profesores = JSON.parse(JSON.stringify(data['obtenerUsuarios']));
      } else {
        this.profesores = [];
      }
    });
  }

}
