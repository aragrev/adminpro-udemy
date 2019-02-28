import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from '../components/account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { MedicoComponent } from './medicos/medico.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
// Service guard
import { AdminGuard, VerificaTokenGuard } from '../services/service.index';

const pagesRoutes: Routes = [
    {path: 'dashboard', component: DashboardComponent, canActivate: [VerificaTokenGuard], data: { titulo: 'Dashboard' } },
    {path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBars' } },
    {path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas' } },
    {path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
    {path: 'rxjs', component: RxjsComponent, data: { tirulo: 'Observables RxJs' } },
    {path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes del Tema' } },
    {path: 'profile', component: ProfileComponent, data: { titulo: 'Perfil de usuario' } },
    {path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Perfil de médico' } },
    {path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'buscador' } },
    // Mantenedores
    {path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard], data: { titulo: 'Mantenedor de usuarios' } },
    {path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenedor de hospitales' } },
    {path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenedor de médicos' } },
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'}
]

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
