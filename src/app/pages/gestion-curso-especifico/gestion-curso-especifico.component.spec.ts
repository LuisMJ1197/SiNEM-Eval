import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCursoEspecificoComponent } from './gestion-curso-especifico.component';

describe('GestionCursoEspecificoComponent', () => {
  let component: GestionCursoEspecificoComponent;
  let fixture: ComponentFixture<GestionCursoEspecificoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionCursoEspecificoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCursoEspecificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
