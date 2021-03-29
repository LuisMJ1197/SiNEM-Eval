import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageTitleComponent } from './components_/page-title/page-title.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { GestionEstudiantesComponent } from './pages/gestion-estudiantes/gestion-estudiantes.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { GestionCursosComponent } from './pages/gestion-cursos/gestion-cursos.component';
import { MisCursosComponent } from './pages/mis-cursos/mis-cursos.component';
import { MiCursoEspecificoComponent } from './pages/mi-curso-especifico/mi-curso-especifico.component';
import { ListaEstudiantesComponent } from './pages/lista-estudiantes/lista-estudiantes.component';
import { GestionCursoEspecificoComponent } from './pages/gestion-curso-especifico/gestion-curso-especifico.component';
import { RegistrosAsistenciaComponent } from './pages/registros-asistencia/registros-asistencia.component';
import { RegistroAsistenciaComponent } from './pages/registro-asistencia/registro-asistencia.component';
import { RegistroAsistenciaEditComponent } from './pages/registro-asistencia-edit/registro-asistencia-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    PageTitleComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    LoginPageComponent,
    GestionEstudiantesComponent,
    GestionUsuariosComponent,
    MyProfileComponent,
    GestionCursosComponent,
    MisCursosComponent,
    MiCursoEspecificoComponent,
    ListaEstudiantesComponent,
    GestionCursoEspecificoComponent,
    RegistrosAsistenciaComponent,
    RegistroAsistenciaComponent,
    RegistroAsistenciaEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
