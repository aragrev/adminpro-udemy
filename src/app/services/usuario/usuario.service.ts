import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService
  ) {
    // console.log('Servicio de usuario listo');
    this.cargarLocalStorage();
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  renuevaToken(){
    const url = `${URL_SERVICIOS}/login/renuevatoken?token=${this.token}`;
    return this.http.get(url)
    .pipe(map((resp: any) => {
      this.token = resp.token;
      localStorage.setItem('token', this.token);
      console.log('Token renovado');
      return true;
    }), catchError(err => {
      this.router.navigate(['/login']);
      swal('Error de token', 'No se puede renovar, token invalido', 'error');
      return throwError(err);
    }));
  }

  cargarLocalStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  loginGoogle(token: string) {
    const url = `${URL_SERVICIOS}/login/google`;
    return this.http.post(url, {token})
    .pipe(map((resp: any) => {
      // console.log(resp);
      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }));
  }

  login(usuario: Usuario, recordar: boolean = false) {
    const url = `${URL_SERVICIOS}/login`;
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    return this.http.post(url, usuario)
    .pipe(map((resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }),catchError(err => {
      swal('Error de utenticación', err.error.message, 'error');
      return throwError(err);
    }));
    
  }

  logout() {
    this.token = '';
    this.usuario = null;
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    this.router.navigate(['/login']);
  }

  crearUsuario(usuario: Usuario) {
    const url = `${URL_SERVICIOS}/usuario`;
    return this.http.post(url, usuario)
    .pipe(map((resp: any) => {
      swal('Usuario creado', usuario.email, 'success');
      return resp.usuario;
    }),catchError(err => {
      swal(err.error.mensaje, err.error.errors.message, 'error');
      return throwError(err);
    }));
  }

  actualizarUsuario(usuario: Usuario) {
    const url = `${URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`;
    return this.http.put(url, usuario)
    .pipe(map((resp: any) => {
      if (usuario._id === this.usuario._id) {
        this.guardarStorage(resp.usuario._id, this.token, resp.usuario, this.menu);
      }
      swal('Usuario actualizado', usuario.nombre, 'success');
      return true;
    }),catchError(err => {
      swal(err.error.mensaje, err.error.errors.message, 'error');
      return throwError(err);
    }));
  }

  cambiarImagen(archivo: File, id: string) {
    this.subirArchivoService.subirArchivo(archivo, 'usuarios', id)
    .then((resp: any) => {
      this.usuario.img = resp.usuario.img;
      swal('Imagen actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario, this.menu);
    })
    .catch(resp => {
      console.log(resp);
    });
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${URL_SERVICIOS}/usuario?desde=${desde}`;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/usuarios/${termino}`;
    return this.http.get(url);

  }

  eliminarUsuario(id: string) {
    const url = `${URL_SERVICIOS}/usuario/${id}?token=${this.token}`;
    return this.http.delete(url);
  }

  // buscarUsuarios(termino: string, collection: string = 'todo', tipo?: string) {
  //   let url: string;
  //   if (tipo) {
  //     url = `${URL_SERVICIOS}/busqueda/${collection}/${tipo}/${termino}`;
  //   } else {
  //     url = `${URL_SERVICIOS}/busqueda/${collection}/${termino}`;
  //   }
  //   return this.http.get(url);

  // }
}
