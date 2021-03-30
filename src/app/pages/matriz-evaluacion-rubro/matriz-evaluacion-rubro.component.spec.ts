import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizEvaluacionRubroComponent } from './matriz-evaluacion-rubro.component';

describe('MatrizEvaluacionRubroComponent', () => {
  let component: MatrizEvaluacionRubroComponent;
  let fixture: ComponentFixture<MatrizEvaluacionRubroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrizEvaluacionRubroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrizEvaluacionRubroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
