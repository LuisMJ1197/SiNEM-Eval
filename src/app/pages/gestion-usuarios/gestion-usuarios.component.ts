import { Component, OnInit, ViewChild } from '@angular/core';
import { User, UsuarioInput } from 'src/app/graphql/models';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements OnInit {
  @ViewChild ('dissmissAddBtn', {static: true}) public dissmissAddBtn: any;

  usuario_nuevo: UsuarioInput = {
    sede_id: 1,
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    telefono: "",
    rol_id: 1
  };
  email_repeated = "";
  usuario_edit: User = {
    sede: {
      sede_id: 1,
      sede_name: ""
    },
    usuario_id: 0,
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    telefono: "",
    rol: {
      rol_id: 1,
      rol_name: ""
    }
  };
  usuario_cambiar: User = null;

  constructor(public uService: UsersService, private authService: AuthService) { }

  ngOnInit(): void {
    this.uService.cargarUsuarios();
  }

  filtrarTodos() {
    this.uService.usuarios_filtrados = JSON.parse(JSON.stringify(this.uService.usuarios));
  }

  filtrarProfesor () {
    this.uService.usuarios_filtrados = this.uService.usuarios.filter(usuario => usuario.rol.rol_name == 'Profesor');
  }

  filtrarAdministrativos () {
    this.uService.usuarios_filtrados = this.uService.usuarios.filter(usuario => usuario.rol.rol_name == 'Administrativo');
  }

  validateAddForm() {
    var form = document.getElementById('addUsuarioForm') as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
    } else {
      form.classList.remove('was-validated');
      this.agregarUsuario();
    }
  }

  dismissAddForm() {
    this.usuario_nuevo = {
      sede_id: 1,
      nombre: "",
      apellido1: "",
      apellido2: "",
      email: "",
      telefono: "",
      rol_id: 1
    };
    this.email_repeated = "";
    var form = document.getElementById('addUsuarioForm') as HTMLFormElement;
    form.classList.remove('was-validated');
  }

  agregarUsuario() {
    if (this.uService.usuarios.filter(usuario => usuario.email.toLowerCase() == this.usuario_nuevo.email.toLowerCase()).length > 0) {
      this.email_repeated = "Ya hay un usuario registrado con este correo."
    } else {
      this.usuario_nuevo.email = this.usuario_nuevo.email.toLowerCase();
      this.uService.agregarUsuario(this.usuario_nuevo, this);
    } 
  }

  terminarAgregarUsuario(result: boolean, msg: string) {
    if (result) {
      this.usuario_nuevo = {
        sede_id: 1,
        nombre: "",
        apellido1: "",
        apellido2: "",
        email: "",
        telefono: "",
        rol_id: 1
      };
      this.email_repeated = "";
      this.dissmissAddBtn.nativeElement.click();
      this.uService.cargarUsuarios();
    } else {
      alert(msg);
    }
  }

  validateEditForm() {
    var form = document.getElementById('editUsuarioForm') as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
    } else {
      form.classList.remove('was-validated');
      this.editarUsuario();
    }
  }

  dismissEditForm() {
    var form = document.getElementById('editUsuarioForm') as HTMLFormElement;
    form.classList.remove('was-validated');
  }

  editarUsuario() {
    this.uService.editarUsuario(this.usuario_edit, this);
  }

  terminarEditarUsuario(result: boolean, msg: string) {
    if (result) {
      this.uService.cargarUsuarios();
    } else {
      alert(msg);
    }
  }

  cambiarRol(usuario: User) {
    if (usuario.usuario_id == this.authService.currentUserValue.user.usuario_id) {
      alert("No puede cambiar el rol a sí mismo.");
    } else {
      this.uService.cambiarRol(usuario.usuario_id, usuario.rol.rol_id == 1 ? 2 : 1, this);
    }
  }

  terminarCambiarRol(result: boolean, msg: string) {
    if (result) {
      this.uService.cargarUsuarios();
    } else {
      alert(msg);
    }
  }
}
