import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
    ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.usuario;
  }

  buscar(termino: string) {
    if (termino.trim().length <= 0) {
      swal('Mensaje', 'Debe ingresar un termino de busqueda', 'warning')
      return;
    }
    this.router.navigate(['/busqueda', termino]);
  }

}
