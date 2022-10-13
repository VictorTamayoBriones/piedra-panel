import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RestaurantesComponent } from './pages/restaurantes/restaurantes.component';
import { RestaurantesFormComponent } from './components/restaurantes-form/restaurantes-form.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { SignInGuardService } from './services/auth/sign-in-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [SignInGuardService]},
  
  { path: 'restaurants', component: RestaurantesComponent, canActivate: [AuthGuardService]},
  { path: 'restaurant-form/create', component: RestaurantesFormComponent, canActivate: [AuthGuardService]},
  { path: 'restaurant-form/update/:id', component: RestaurantesFormComponent, canActivate: [AuthGuardService]},
  { path: 'restaurants-table', component: RestaurantesComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
