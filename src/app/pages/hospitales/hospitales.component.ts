import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService, ModalUploadService } from '../../services/service.index';
import swal from 'sweetalert';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  totalReg: number = 0;
  cargando: boolean = true;

  constructor(
    public hospitalService: HospitalService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this.modalUploadService.notificacion.subscribe(resp => {
      this.cargarHospitales();
    });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde)
    .subscribe((resp: any) => {
      this.hospitales = resp.hospitales;
      this.totalReg = resp.total;
      this.cargando = false;
    });
  }

  buscarHospitales(termino: string) {
    if (termino.length > 0) {
      this.cargando = true;
      this.hospitalService.buscarHospitales(termino)
      .subscribe((resp: any) => {
        this.hospitales = resp.hospitales;
        this.cargando = false;
      });
    } else {
      this.cargarHospitales();
    }
  }

  crearHospital() {

    swal({
      title: 'Crear hospital',
      text: 'Ingrese nombre hospital',
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Nombre del hospital'
        }
      },
      icon: 'info',
      buttons: [
        'Cancelar',
        'Crear hospital'
      ],
      dangerMode: true
    }).then ((valor: string) => {
      if (!valor || valor.length === 0) {
        return;
      }
      this.hospitalService.crearHospital(valor)
      .subscribe(resp => {
        this.cargarHospitales();
        swal({
          title: 'Resultado',
          text: 'El hospital ha sido creado exitosamente!',
          icon: 'success'
        });
      });
    });

  }

  actualizarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital)
    .subscribe();
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: '¿Esta Seguro?',
      text: '¡Ya no podrás recuperar hospital: ' + hospital.nombre + '!',
      icon: 'warning',
      buttons: [
        'No, Cancelar!',
        'Si, Estoy seguro!'
      ],
      dangerMode: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        this.hospitalService.eliminarHospital(hospital._id)
        .subscribe(resp => {
          swal({
            title: 'Resultado',
            text: 'El hospital ha sido eliminado exitosamente!',
            icon: 'success'
          });
          this.desde = 0;
          this.cargarHospitales();
        });
      } else {
        swal('Cancelado', 'Te has arrepentido de eliminar el hospital!', 'error');
      }
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
    this.cargarHospitales();
  }

  mostrarModal(id: string) {
    console.log(id);
    this.modalUploadService.mostarModal('hospitales', id);
  }

}
