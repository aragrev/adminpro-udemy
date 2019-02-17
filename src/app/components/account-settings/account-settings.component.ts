import { Component, OnInit, Inject } from '@angular/core';
// import { DOCUMENT } from '@angular/platform-browser';
import { SettingsService } from '../../services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  // constructor(@Inject(DOCUMENT) private _document) { } una manera de realizar. **
  constructor(public settingsService: SettingsService) { }

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarTema(tema: string, link: any) {
    this.aplicarCheck(link);
    this.settingsService.aplicarTema(tema);
    // const url = `assets/css/colors/${tema}.css`;
    // this._document.getElementById('tema').setAttribute('href', url); una manera de realizar **
  }

  aplicarCheck(link: any) {
    const selectores: any = document.getElementsByClassName('selector');
    for (const ref of selectores) {
      ref.classList.remove('working');
    }
    link.classList.add('working');
  }

  colocarCheck() {
    const selectores: any = document.getElementsByClassName('selector');
    const tema = this.settingsService.ajustes.tema;
    for (const ref of selectores) {
      if (ref.getAttribute('data-theme') === tema) {
        ref.classList.add('working');
        break;
      }
    }
  }
}
