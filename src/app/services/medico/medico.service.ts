import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService
  ) { }

  cargarMedicos(desde: number = 0) {
    const url = `${URL_SERVICIOS}/medico?desde=${desde}`;
    return this.http.get(url)
    .pipe(map((resp: any) => {
      this.totalMedicos = resp.total;
      return resp.medicos;
    }));
  }

  buscarMedicos(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${termino}`;
    return this.http.get(url)
    .pipe(map((resp: any) => {
      return resp.medicos;
    }));
  }

  borrarMedico(id: string) {
    const url = `${URL_SERVICIOS}/medico/${id}?token=${this.usuarioService.token}`;
    return this.http.delete(url);
  }

  guardarMedico(medico: Medico) {
    let url = `${URL_SERVICIOS}/medico`;
    
    if(medico._id) {
      // Actualizar
      url += `/${medico._id}?token=${this.usuarioService.token}`;
      return this.http.put(url, medico)
        .pipe(map((resp: any) => {
          swal('Médico actualizado', medico.nombre, 'success');
          return resp.medico;
        }));

    } else {
      // Crear
      url += `?token=${this.usuarioService.token}`; 
      return this.http.post(url, medico)
        .pipe(map((resp: any) => {
          swal('Médico creado', medico.nombre, 'success');
          return resp.medico;
        }));
    }
  }

  obtenerMedico(id: string) {
    const url = `${URL_SERVICIOS}/medico/${id}`;
    return this.http.get(url)
    .pipe(map((resp: any) => {
      return resp.medico;
    }));
  }

}
