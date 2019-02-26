import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  token: string;
  hospital: Hospital;

  constructor(
    public http: HttpClient,
    public subirArchivoService: SubirArchivoService,
    public usuarioService: UsuarioService
  ) { }

  getToken() {
    if (this.usuarioService.token) {
      this.token = this.usuarioService.token;
    } else { return; }
  }

  crearHospital(nombre: string) {
    this.getToken();
    if (this.token.length > 5) {
      const url = `${URL_SERVICIOS}/hospital?token=${this.token}`;
      return this.http.post(url, {nombre})
      .pipe(map((resp: any) => {
        swal('Hospital creado', nombre, 'success');
        return resp.hospital;
      }));
    } else {
      console.log('Token no válido');
      return;
    }
  }

  actualizarHospital(hospital: Hospital) {
    this.getToken();
    if (this.token.length > 5) {
      const url = `${URL_SERVICIOS}/hospital/${hospital._id}?token=${this.token}`;
      return this.http.put(url, hospital)
      .pipe(map((resp: any) => {
        swal('Hospital actualizado', hospital.nombre, 'success');
        return true;
      }));
    } else {
      console.log('Token no válido');
      return;
    }
  }

  cambiarImagen(archivo: File, id: string) {
    this.subirArchivoService.subirArchivo(archivo, 'hospitales', id)
    .then((resp: any) => {
      this.hospital.img = resp.hospital.img;
      swal('Imagen actualizada', this.hospital.nombre, 'success');
    })
    .catch(resp => {
      console.log(resp);
    });
  }

  cargarHospitales(desde: number = 0) {
    const url = `${URL_SERVICIOS}/hospital?desde=${desde}`;
    return this.http.get(url);
  }

  buscarHospitales(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/hospitales/${termino}`;
    return this.http.get(url);

  }

  obtenerHospital(id: string) {
    const url = `${URL_SERVICIOS}/hospital/${id}`;
    return this.http.get(url);

  }

  eliminarHospital(id: string) {
    this.getToken();
    if (this.token.length > 5) {
      const url = `${URL_SERVICIOS}/hospital/${id}?token=${this.token}`;
      return this.http.delete(url);
    } else {
      console.log('Token no válido');
      return;
    }
  }

}
