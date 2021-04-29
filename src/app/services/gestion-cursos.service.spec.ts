import { TestBed } from '@angular/core/testing';

import { GestionCursosService } from './gestion-cursos.service';

describe('GestionCursosService', () => {
  let service: GestionCursosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionCursosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
