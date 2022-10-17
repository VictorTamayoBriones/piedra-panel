import { Component, OnInit } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { RestaurantesService } from 'src/app/services/restaurantes/restaurantes.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AddTagModalComponent } from '../add-tag-modal/add-tag-modal.component';

@Component({
  selector: 'app-restaurantes-form',
  templateUrl: './restaurantes-form.component.html',
  styleUrls: ['./restaurantes-form.component.scss']
})
export class RestaurantesFormComponent implements OnInit {

  public loader: boolean = false;
  public invalid: boolean = false

  public isEdit: boolean = false;
  public restaurantId: string | null = '';
  public creating: boolean = false;
  public currentImage: string = '';
  public currentImageRef: string = '';
  public tags: any[] = [];

  public file: any[] = [];
  ref?: AngularFireStorageReference;
  task?: AngularFireUploadTask;
  downloadURL?: Observable<string>;
  
  
  public restaurantForm: FormGroup;
  constructor(
    private router: Router,
    private restaurantService: RestaurantesService,
    private route: ActivatedRoute,
    public storage: AngularFireStorage,
    public dialog: MatDialog,
    private tagService: TagsService
  ) { 
    this.restaurantForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      lat: new FormControl('', Validators.required),
      long: new FormControl('', Validators.required),
      tags: new FormControl('', Validators.required),
      coverPhoto: new FormControl(''),
    })
  }

  ngOnInit() {
    if(this.router.url.includes('update')){
      this.isEdit = true;
      this.restaurantId = this.route.snapshot.paramMap.get("id");
      this.pathEdit(this.restaurantId!);
      this.getRestaurant();
    }
    this.getTags();
  }

  async getTags() {
    try {
      let response = await this.tagService.getTags();
      this.tags = response
    } catch (error) {
      console.log(error);
    }
  }

  async pathEdit(id: string) {
    try {
      let res = await this.restaurantService.getById(id);      
      this.restaurantForm.patchValue(res.data);
      console.log('form', this.restaurantForm.value);
      
      this.currentImage = res.data.coverPhoto.path;
      this.currentImageRef = res.data.coverPhotoRef;

      console.log('data',res.data);
      
    } catch (err) {
      console.error(err)
      this.router.navigateByUrl('/restaurants');
    }
  }

  async getRestaurant() {
    try {
      let response = await this.restaurantService.getById(this.restaurantId!);

      if (response.code == 200) {
        this.restaurantForm.patchValue(response.data)
      } else {
        this.shootSimpleAlert('error', 'Algo ocurrió al intentar traer la información');
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  openAddTagModal() {
    const dialogRef = this.dialog.open(AddTagModalComponent, {
      width: '90%',
      maxWidth: '450px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  async validateForm() {
    if (this.restaurantForm.invalid) {
     this.restaurantForm.markAllAsTouched();
    //   this.shootSimpleAlert('info', 'Todos los campos son obligatorios')
    return;
    }

    this.saveRestaurant()
  }

  shootSimpleAlert(icon: SweetAlertIcon, title: string, text?: string) {
    Swal.fire({
      position: 'center',
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: true,
      confirmButtonColor: "#ff5900",
    });
  }

  onSelect(event: any) {
    if (this.file.length >= 1) {
      this.imgSizeError('Se ha excedido el número máximo de imágenes aceptadas');
      return;
    }
    this.file.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.file.splice(this.file.indexOf(event), 1);
  }

  imgSizeError(text: string) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Tamaño excedido',
      text,
      confirmButtonText: 'Entendido',
      customClass: {
        container: "modal-warning"
      }
    })
  }

  async saveRestaurant() {
    console.log(this.restaurantForm)
    this.creating = true;
    if (this.isEdit) {
      this.updatePost();
      return;
    }
    try {
      if (this.file.length == 1) {
        let url = await this.uploadImage();

        await this.restaurantService.create(this.restaurantForm.value);
        this.creating = false;
        await Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Restaurante creado correctamente',
          showConfirmButton: true,
        });
        this.router.navigate(['restaurants']);
      } else {
        if (this.file.length > 1) {
          this.creating = false;
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Sólo puedes subir una imagen de portada',
            showConfirmButton: true,
          });
        } else {
          this.creating = false;
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Necesita subir una imagen',
            showConfirmButton: true,
          });
        }
      }
    } catch (e: any) {
      this.creating = false;
      console.error('error:', e);
      if (e.status == 413) {
        this.creating = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El tamaño de las imágenes dentro del contenido excede el límite permitido',
          text: 'Sugerencia: subir imágenes menos pesadas',
          showConfirmButton: true,
        })
      } else {
        this.creating = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Ha ocurrido un error',
          showConfirmButton: true,
        })
      }
    }
  }

  async updatePost() {
    try {
      if (this.file.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: '¿Desea editar este restaurante?',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.uploadImage()
            let response = await this.restaurantService.update(this.restaurantForm.value, this.restaurantId!)
            if (response?.code == 200) {
              await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Restaurante editado correctamente',
                showConfirmButton: true,
              });
              this.router.navigateByUrl('restaurants')
            }
          }
        })
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¿Desea editar este restaurante?',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            let response = await this.restaurantService.update(this.restaurantForm.value, this.restaurantId!)
            if (response?.code == 200) {
              await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Restaurante editado correctamente',
                showConfirmButton: true,
              });
              this.router.navigateByUrl('/')
            }
          }
        })
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Ha ocurrido un error',
        showConfirmButton: true,
      })
    }
  }

  uploadImage() {
    return new Promise<any>((resolve, reject) => {
      const id = Math.random().toString(36).substring(2);
      const filePath = "restaurants/" + id + "." + this.file[0].name.split(".")[1];
      this.ref = this.storage.ref(filePath);
      this.task = this.storage.upload(filePath, this.file[0]);
      this.task!.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = this.ref!.getDownloadURL()
          this.downloadURL.subscribe(url => {
            let obj = {
              path: url,
              size: this.file[0].size
            }
            this.restaurantForm.controls['coverPhoto'].setValue(obj);
            resolve(url)
          });
        })
      ).subscribe();
    })
  }

  public objectComparisonFunction = function (option: any, value: any): boolean {
    return option.tag === value.tag;
  }

}
