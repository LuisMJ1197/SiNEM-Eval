import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CURRENT_USER } from '../constants/constants';
import { LoginData } from '../graphql/models';
import { Apollo } from 'apollo-angular';
import { LoginMutation } from '../graphql/queries';
import { ToastrService } from 'ngx-toastr';
import { ResultListener } from '../interfaces/result-listener';

@Injectable({
  providedIn: 'root'
})

/**
 * Se encarga de las acciones relacionadas con el login y la comunicación con la API.
 */
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

  constructor(private http: HttpClient, private apollo: Apollo, private toast: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<LoginData>(JSON.parse(localStorage.getItem(CURRENT_USER)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email, password, action: number, listener: ResultListener) {
    this.apollo.mutate({
      mutation: LoginMutation,
      variables: {
        email: email,
        password: password
      }
    }).subscribe(({data}) => {
      if (data != null && data['login'] != null) {
        this.saveUserData(data['login'] as LoginData);
        listener.handleResult(true, "", action, 0);
      } else {
        listener.handleResult(false, "", action, 0);
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
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
