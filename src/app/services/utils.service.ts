import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Modalidad } from '../graphql/models';
import { ObtenerModalidades } from '../graphql/queries';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  modalidades = [];
  
  constructor(private apollo: Apollo) {
    this.apollo.query({
      query: ObtenerModalidades
    }).subscribe(({data}) => {
      if (data != null && data['obtenerModalidades'] != null) {
        this.modalidades = data['obtenerModalidades'] as Modalidad[];
      } else {
        this.modalidades = [];
      }
    });
  }
}
