import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { GestionCursosComponent } from './pages/gestion-cursos/gestion-cursos.component';
import { GestionEstudiantesComponent } from './pages/gestion-estudiantes/gestion-estudiantes.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MisCursosComponent } from './pages/mis-cursos/mis-cursos.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';

const routes: Routes = [
  {
    path: '',                      
    component: HomeLayoutComponent,
    children: [
      {
        path: 'courses-management',
        component: GestionCursosComponent,
      },
      {
        path: 'users-management',
        component: GestionUsuariosComponent  
      },
      {
        path: 'students-managment',
        component: GestionEstudiantesComponent  
      },
      {
        path: 'my-courses',
        component: MisCursosComponent  
      },
      {
        path: 'profile',
        component: MyProfileComponent  
      }
    ]
  },
  {
    path: 'a',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent  
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
