import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CURRENT_USER } from '../constants/constants';
import { LoginData } from '../graphql/models';
import { Apollo } from 'apollo-angular';
import { LoginMutation } from '../graphql/queries';
import { LoginPageComponent } from '../pages/login-page/login-page.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<LoginData>;
  public currentUser: Observable<LoginData>;

  get isLoggedIn(): boolean {
    return this.currentUserSubject.asObservable() != null;
  }

  get currentUserValue(): LoginData {
    return this.currentUserSubject.value;
  }

  get getCurrentUser() {
    return this.currentUserSubject.value;
  }

  constructor(private http: HttpClient, private apollo: Apollo) {
    this.currentUserSubject = new BehaviorSubject<LoginData>(JSON.parse(localStorage.getItem(CURRENT_USER)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email, password, callback, caller: LoginPageComponent) {
    this.apollo.mutate({
      mutation: LoginMutation,
      variables: {
        email: email,
        password: password
      }
    }).subscribe(({data}) => {
      if (data != null && data['login'] != null) {
        this.saveUserData(data['login'] as LoginData);
        callback(data['login'] as LoginData, caller);
      } else {
        callback(null, caller);
      }
    }, (error) => {
      callback(null, caller);
    });
  }

  saveUserData(data: LoginData) {
    localStorage.setItem(CURRENT_USER, JSON.stringify(data));
    this.currentUserSubject.next(data);
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem(CURRENT_USER);
    this.currentUserSubject.next(null);
  }
}
