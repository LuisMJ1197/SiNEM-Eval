import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/graphql/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  roles = ["", "Profesor", "Administrativo"];
  
  userLoggedIn: User;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userLoggedIn = this.authService.getCurrentUser.user;
    console.log(this.userLoggedIn);
  }

  cambiarContrasenia() {

  }

}
