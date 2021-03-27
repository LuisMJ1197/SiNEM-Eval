import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEstudiantesComponent } from './gestion-estudiantes.component';

describe('GestionEstudiantesComponent', () => {
  let component: GestionEstudiantesComponent;
  let fixture: ComponentFixture<GestionEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionEstudiantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
