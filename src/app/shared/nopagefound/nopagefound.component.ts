import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Router } from '@angular/router';

declare function init_plugins(): any;
@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.component.css']
})
export class NopagefoundComponent implements OnInit {

  anio: number = new Date().getFullYear();

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  ngOnInit() {
    init_plugins();
  }

  mover() {
    if (this.usuarioService.estaLogueado) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
