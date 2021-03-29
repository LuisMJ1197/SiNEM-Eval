import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrosAsistenciaComponent } from './registros-asistencia.component';

describe('RegistrosAsistenciaComponent', () => {
  let component: RegistrosAsistenciaComponent;
  let fixture: ComponentFixture<RegistrosAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrosAsistenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrosAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
