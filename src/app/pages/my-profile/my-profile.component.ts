import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Apollo } from 'apollo-angular';
import { User } from 'src/app/graphql/models';
import { CambiarContrasenia, ConfirmarContraseniaAnterior } from 'src/app/graphql/queries';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  @ViewChild('change_closebutton', {static: true}) public changePassword: any;
  @ViewChild('success_closebutton', {static: true}) public succesChange: any;

  roles = ["", "Profesor", "Administrativo"];
  userLoggedIn: User;
  contraseniaAnterior = "";
  nuevaContrasenia = "";
  confirmacionNuevaContrasenia = "";
  antErr = "";
  nuevaErr = "";
  confirmErr = "";

  constructor(private authService: AuthService, private apollo: Apollo) { }

  ngOnInit(): void {
    this.userLoggedIn = this.authService.getCurrentUser.user;
    console.log(this.succesChange);
  }

  cambiarContrasenia() {
    this.apollo.query({
      query: ConfirmarContraseniaAnterior,
      variables: {
        usuario_id: this.userLoggedIn.usuario_id,
        contrasenia: this.contraseniaAnterior
      }
    }).subscribe(( { data } ) => {
      if (data != null && data['confirmarContraseniaAnterior'] != null) {
        if (data['confirmarContraseniaAnterior'].res) {
          this.antErr = "";
          if (this.validateNuevaContrasenia(this.nuevaContrasenia)) {
            this.nuevaErr = "";
            if (this.nuevaContrasenia == this.contraseniaAnterior) {
              this.nuevaErr = "La nueva contraseña no puede ser igual a la anterior.";
            } else {
              if (this.nuevaContrasenia == this.confirmacionNuevaContrasenia) {
                this.apollo.mutate({
                  mutation: CambiarContrasenia,
                  variables: {
                    usuario_id: this.userLoggedIn.usuario_id,
                    new_password: this.nuevaContrasenia
                  }
                }).subscribe(({data}) => {
                  if (data != null && data['cambiarContrasenia'] != null) {
                    this.changePassword.nativeElement.click();
                    this.succesChange.nativeElement.click();
                    this.nuevaContrasenia = "";
                    this.confirmacionNuevaContrasenia = "";
                    this.contraseniaAnterior = "";
                    this.confirmErr = "";
                    this.nuevaErr = "";
                    this.antErr = "";
                  } else {
                    alert("Ha ocurrido un error.");
                  }
                });
              } else {
                this.confirmErr = "Las contraseñas no coinciden.";
              }
            }
          }
        } else {
          this.antErr = "La contraseña actual no es correcta.";
        }
      } else {
        alert("Ha ocurrido un error.");
      }
    });
  }

  validateNuevaContrasenia(contra: String) {
    if (contra.length < 6) {
      this.nuevaErr = "La contraseñaa debe tener un mínimo de 6 caracteres.";
      return false;
    } else {
      if (this.hasNumber(contra) && this.hasLetter(contra)) {
        return true;
      } else {
        this.nuevaErr = "La contraseña debe tener al menos una letra y al menos un número.";
      }
    }
  }

  hasNumber(myString) {
      return /\d/.test(myString);
  }

  hasLetter(myString) {
    return /[a-zA-Z]/.test(myString);
}

}
