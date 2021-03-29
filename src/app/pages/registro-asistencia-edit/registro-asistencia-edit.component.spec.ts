import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAsistenciaEditComponent } from './registro-asistencia-edit.component';

describe('RegistroAsistenciaEditComponent', () => {
  let component: RegistroAsistenciaEditComponent;
  let fixture: ComponentFixture<RegistroAsistenciaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroAsistenciaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAsistenciaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
