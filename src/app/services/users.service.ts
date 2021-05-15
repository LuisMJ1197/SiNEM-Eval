import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { User, UsuarioInput } from '../graphql/models';
import { CambiarRol, EditarUsuario, ObtenerUsuarios, RegistrarUsuario } from '../graphql/queries';
import { ResultListener } from '../interfaces/result-listener';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  usuarios: User[] = [];
  usuarios_filtrados: User[] = [];

  constructor(private apollo: Apollo, private toast: ToastrService) {

  }

  cargarUsuarios() {
    this.apollo.query({
      query: ObtenerUsuarios,
      fetchPolicy: 'network-only'
    }).subscribe(({data}) => { 
      console.log(data)
      if (data != null && data['obtenerUsuarios'] != null) {
        this.usuarios = data['obtenerUsuarios'];
        this.usuarios_filtrados = JSON.parse(JSON.stringify(this.usuarios));
      } else {
        this.toast.error("Hubo un error al cargar la información de los usuarios. Recargue la página.", "" , {positionClass: "toast-top-center"});
        this.usuarios = [];
        this.usuarios_filtrados = [];
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }

  agregarUsuario(usuario: UsuarioInput, action: number, listener: ResultListener) {
    this.apollo.mutate({
      mutation: RegistrarUsuario,
      variables: {
        usuario: usuario
      }
    }).subscribe(({data}) => {
      if (data != null && data['registrarUsuario'] != null) {
        if (data['registrarUsuario'].status == "ok") {
          listener.handleResult(true, "", action, 0);
        } else {
          listener.handleResult(false, "Ha ocurrido un error.", action, 0);
        }
       } else {
        listener.handleResult(false, "Ha ocurrido un error.", action, 0);
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }

  cambiarRol(usuario_id: number, rol_id: number, action: number, listener: ResultListener) {
    this.apollo.mutate({
      mutation: CambiarRol,
      variables: {
        usuario_id: usuario_id,
        rol_id: rol_id
      }
    }).subscribe(({data}) => {
      if (data != null && data['cambiarRol'] != null) {
        if (data['cambiarRol'].status == "ok") {
          listener.handleResult(true, "", action, 0);
        } else {
          listener.handleResult(false, "Ha ocurrido un error.", action, 0);
        }
       } else {
        listener.handleResult(false, "Ha ocurrido un error.", action, 0);
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }

  editarUsuario(usuario: User, action: number, listener: ResultListener) {
    this.apollo.mutate({
      mutation: EditarUsuario,
      variables: {
        usuario: {
          usuario_id: usuario.usuario_id,
          nombre: usuario.nombre,
          apellido1: usuario.apellido1,
          apellido2: usuario.apellido2,
          telefono: usuario.telefono,
          rol_id: usuario.rol.rol_id
        }
      }
    }).subscribe(({data}) => {
      if (data != null && data['editarUsuario'] != null) {
        if (data['editarUsuario'].status == "ok") {
          listener.handleResult(true, "", action, 0);
        } else {
          listener.handleResult(false, "Ha ocurrido un error.", action, 0);
        }
       } else {
        listener.handleResult(false, "Ha ocurrido un error.", action, 0);
      }
    }, (error) => {
      this.toast.error("Ha ocurrido un error. Inténtelo de nuevo.", "", {positionClass: "toast-top-center"});
    });
  }
}
