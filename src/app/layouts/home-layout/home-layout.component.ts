import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/graphql/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {
  ADMINISTRATIVO = 2;
  PROFESOR = 1;
  roles = ["", "Profesor", "Administrativo"];
  GESTION_CURSOS: string = "courses-management";
  GESTION_USUARIOS: string = "users-management";
  GESTION_ESTUDIANTES: string = "students-managment";
  MIS_CURSOS: string = "my-courses";
  PROFILE: string = "my-profile";

  menuExtended: boolean = true;
  optionSelected: number = 0;
  userLoggedIn: User;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userLoggedIn = this.authService.getCurrentUser.user;
    if (this.router.url.indexOf(this.GESTION_CURSOS) > -1) {
      this.optionSelected = 0;
    } else if (this.router.url.indexOf(this.GESTION_USUARIOS) > -1) {
      this.optionSelected = 1;
    } else if (this.router.url.indexOf(this.GESTION_ESTUDIANTES) > -1) {
      this.optionSelected = 2;
    } else if (this.router.url.indexOf(this.MIS_CURSOS) > -1) {
      this.optionSelected = 3;
    } else {
      this.optionSelected = 4;
    }
  }

  goRoute(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
