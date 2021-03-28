import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiCursoEspecificoComponent } from './mi-curso-especifico.component';

describe('MiCursoEspecificoComponent', () => {
  let component: MiCursoEspecificoComponent;
  let fixture: ComponentFixture<MiCursoEspecificoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiCursoEspecificoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiCursoEspecificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
