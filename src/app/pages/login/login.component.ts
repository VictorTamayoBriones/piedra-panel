import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loading = false;
  public loginForm!: FormGroup;
  public noUser = false;
  public error = false;
  public errorMessage = 'Mensaje de error';

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private authService: AuthService
  ) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,6}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
  }

  async submitForm(){
    if (this.loginForm.invalid) {
      // this.shootSimpleAlert('error', 'Asegurate de ingresar los datos correctamente')
      this.loginForm.markAllAsTouched();
      return;
    }else{
      try {
        await this.authService.login(
          this.loginForm.value.email,
          this.loginForm.value.password
        )
        this.router.navigate(['restaurants']) 
      } catch (error: any) {
        this.error = true;
        this.loading = false;
        error.code == 'auth/user-not-found'
          ? (this.errorMessage =
            'El usuario no existe en la base de datos. Asegúrese que el usuario sea correcto.')
          : (this.errorMessage = 'Ocurrió un error, intente nuevamente');
        return
      }
    }

  }

}
