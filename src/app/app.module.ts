import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { RestaurantesComponent } from './pages/restaurantes/restaurantes.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RestaurantesFormComponent } from './components/restaurantes-form/restaurantes-form.component';
import { RestaurantesTableComponent } from './components/restaurantes-table/restaurantes-table.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialModule } from './material/material.module';
import { BodyComponent } from './components/body/body.component';
import { DishesTableComponent } from './components/dishes-table/dishes-table.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RestaurantesComponent,
    SidenavComponent,
    RestaurantesFormComponent,
    RestaurantesTableComponent,
    BodyComponent,
    DishesTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxDropzoneModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
