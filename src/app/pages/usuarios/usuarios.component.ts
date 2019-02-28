import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService, ModalUploadService } from '../../services/service.index';
import swal from 'sweetalert';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalReg: number = 0;
  cargando: boolean = true;

  constructor(
    public usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.modalUploadService.notificacion.subscribe(resp => {
      this.cargarUsuarios();
    });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe((resp: any) => {
      this.usuarios = resp.usuarios;
      this.totalReg = resp.total;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    this.desde = this.desde + valor;
    if (this.desde < 0) {
      this.desde = 0;
      return;
    }
    if (this.desde >= this.totalReg) {
      this.desde = this.desde - 5;
      return;
    }
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length > 0) {
      this.cargando = true;
      this.usuarioService.buscarUsuarios(termino)
      .subscribe((resp: any) => {
        this.usuarios = resp.usuarios;
        this.cargando = false;
      });
    } else {
      this.cargarUsuarios();
    }
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this.usuarioService.usuario._id) {
      swal('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }
    swal({
      title: '¿Esta Seguro?',
      text: '¡Ya no podrás recuperar esta cuenta de: ' + usuario.nombre + '!',
      icon: 'warning',
      buttons: [
        'No, Cancelar!',
        'Si, Estoy seguro!'
      ],
      dangerMode: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        this.usuarioService.eliminarUsuario(usuario._id)
        .subscribe(resp => {
          swal({
            title: 'Resultado',
            text: 'La cuenta de usuario ha sido eliminada exitosamente!',
            icon: 'success'
          });
          this.desde = 0;
          this.cargarUsuarios();
        });
        // swal({
        //   title: 'Resultado',
        //   text: 'La cuenta de usuario ha sido eliminada exitosamente!',
        //   icon: 'success'
        // }).then(() => {
        //   console.log('borrado'); // <--- submit form programmatically
        // });
      } else {
        swal('Cancelado', 'Te has arrepentido de eliminar la cuenta!', 'error');
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this.usuarioService.actualizarUsuario(usuario)
    .subscribe();
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostarModal('usuarios', id);
  }

}
