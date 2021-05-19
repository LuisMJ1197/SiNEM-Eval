import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'selenium-webdriver';
import { LoginData } from 'src/app/graphql/models';
import { ResultListener } from 'src/app/interfaces/result-listener';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, ResultListener {
  private LOGIN_ACTION = 0;
  
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
    this.authService.login(this.email, this.password, this.LOGIN_ACTION, this);
  }

  handleResult(result: boolean, msg: string, action: number, resultData: number) {
    switch(action) {
      case this.LOGIN_ACTION: {
        if (result) {
          this.router.navigate(["/my-profile"]);
        } else {
          this.error = true;
        }
        break;
      }
    }
  }

}
