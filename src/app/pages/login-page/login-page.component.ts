import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'selenium-webdriver';
import { LoginData } from 'src/app/graphql/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  error: boolean = false;
  email: String = "";
  password: String = "";

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["/my-profile"]);
    }
  }

  login() {
    this.authService.login(this.email, this.password, this.logincallback, this);
  }

  logincallback(user_data: LoginData, caller: LoginPageComponent) {
    if (user_data == null) {
      caller.error = true;
    } else {
      caller.router.navigate(["/my-profile"]);
    }
  }
}
