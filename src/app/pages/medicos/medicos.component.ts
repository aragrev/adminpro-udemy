import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService, ModalUploadService } from '../../services/service.index';
import swal from 'sweetalert';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  totalReg: number = 0;
  cargado: boolean = true;

  constructor(
    public modalUploadService: ModalUploadService,
    public medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
    this.modalUploadService.notificacion
    .subscribe( resp => {
      this.cargarMedicos();

    });
  }

  cargarMedicos() {
    this.cargado = true;
    this.medicoService.cargarMedicos(this.desde)
    .subscribe((medicos: any) => {
      this.medicos = medicos;
      this.totalReg = this.medicoService.totalMedicos;
      this.cargado = false;
    });
  }

  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this.cargado = true;
    this.medicoService.buscarMedicos(termino)
    .subscribe((medico: any) => {
      this.medicos = medico;
      this.cargado = false;
    });
  }

  borrarMedico(medico: Medico) {
    swal({
      title: '¿Esta Seguro?',
      text: '¡Ya no podrás recuperar a: ' + medico.nombre + '!',
      icon: 'warning',
      buttons: [
        'No, Cancelar!',
        'Si, Estoy seguro!'
      ],
      dangerMode: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        this.medicoService.borrarMedico(medico._id)
        .subscribe(resp => {
          swal({
            title: 'Resultado',
            text: 'El médico ha sido eliminado exitosamente!',
            icon: 'success'
          });
          this.desde = 0;
          this.cargarMedicos();
        });
      } else {
        swal('Cancelado', 'Te has arrepentido de eliminar el médico!', 'error');
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
    this.cargarMedicos();
  }

  actualizarMedico(medico: any) {
    let medicoTemp: Medico = new Medico;
    medicoTemp = medico;
    medicoTemp.hospital = medico.hospital._id;
    this.medicoService.guardarMedico(medicoTemp)
      .subscribe(() =>
        this.cargarMedicos()
      );
  }

  mostrarModal(id: string) {
    console.log(id);
    this.modalUploadService.mostarModal('medicos', id);
  }

}
