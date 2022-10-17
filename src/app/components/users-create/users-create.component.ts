import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminsService } from 'src/app/services/admins-services/admins.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('200ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('200ms', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ]
    )
  ]
})

export class UsersCreateComponent implements OnInit {

  public uploadProgress!: Observable<number>;
  public urlImgListado: any;
  public loader: boolean = false;
  public cover: any = [];
  public items: File[] = [];
  public adminsForm: FormGroup;
  public invalid: boolean = false
  public invalidFlag: string = '';
  public arrayColors: any;
  public color: any;
  public toggle: any;

  constructor(
    private router: Router,
    private service: AdminsService
  ) { 
    this.adminsForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }

  ngOnInit(): void {
  }
  formValidation() {
    if (this.adminsForm.controls['name'].errors) {
      this.invalidFlag = 'invalid-name';
      this.invalid = true
    };
    if (this.adminsForm.controls['email'].errors) {
      this.invalidFlag = 'invalid-email';
      this.invalid = true
    };
    if (this.adminsForm.controls['password'].errors) {
      this.invalidFlag = 'invalid-password';
      this.invalid = true
    };
    if (this.adminsForm.invalid) {
      this.invalidFlag = 'invalid-all'
      return
    }

    this.saveProduct()

  }
  async saveProduct() {
    try {
      Swal.fire('¡Subiendo!', 'Espere un momento en lo que se sube la información', 'info');
      Swal.showLoading();
      this.loader = true;
      var form = this.adminsForm.value;

      var exist = await this.service.adminExist(form.email);
      if (exist) {
        this.loader = false;
        Swal.fire('Lo sentimos', 'El correo ingresado ya esta en uso', 'warning');
        return;
      }

      // let product: Product = {
      //   name: form.name,
      //   description: form.description,
      //   option: '',
      //   category: form.category,
      //   price: form.price,
      //   stock: form.stock,
      //   cover: { ref: "", url: "" },
      //   images: [],
      //   type: form.type,
      //   info: form.info,
      //   specs: form.specs,
      //   favorite: false,
      //   boxId: '',
      //   created: new Date().toISOString(),
      // }

      // let response = await this.productService.createProduct(product);
      await this.service.add(form);

      this.loader = false;
      Swal.close()
      await Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuario creado con éxito',
        showConfirmButton: false,
        confirmButtonColor: "#ff5900",
        timer: 1500,
        customClass: {
          container: "modal-warning"
        }
      })
      this.router.navigateByUrl('/users');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: 'Favor de intentarlo nuevamente'
      })
    }
  }

  shootSimpleAlert(title: string, text: string) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Entendido',
      confirmButtonColor: "#ff5900",
    })
  }

  resetValidations(flag?: string) {
    this.invalid = false
    this.invalidFlag = ''
  }
}

