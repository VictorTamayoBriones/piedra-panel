import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RestaurantesComponent } from './pages/restaurantes/restaurantes.component';
import { RestaurantesFormComponent } from './components/restaurantes-form/restaurantes-form.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { SignInGuardService } from './services/auth/sign-in-guard.service';
import { UsersTableComponent } from './pages/users-table/users-table.component';
import { UsersCreateComponent } from './components/users-create/users-create.component';
import { DishesFormComponent } from './components/dishes-form/dishes-form.component';
import { ContactsComponent } from './pages/contacts/contacts.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [SignInGuardService]},

  //Restaurantes
  { path: 'restaurants', component: RestaurantesComponent, canActivate: [AuthGuardService]},
  { path: 'restaurant-form/create', component: RestaurantesFormComponent, canActivate: [AuthGuardService]},
  { path: 'restaurant-form/update/:id', component: RestaurantesFormComponent, canActivate: [AuthGuardService]},
  { path: 'restaurants-table', component: RestaurantesComponent, canActivate: [AuthGuardService]},

  //Users
  { path: 'users', component: UsersTableComponent, canActivate: [AuthGuardService] },
  { path: 'users/create', component: UsersCreateComponent, canActivate: [AuthGuardService] },

  //Diches
  { path: 'dishes-form/create/:id', component: DishesFormComponent, canActivate: [AuthGuardService]},
  { path: 'dishes-form/edit/:id', component: DishesFormComponent, canActivate: [AuthGuardService]},
  { path: 'dishes-form/update/:id', component: DishesFormComponent, canActivate: [AuthGuardService]},

  //Contacts
  { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuardService]},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
