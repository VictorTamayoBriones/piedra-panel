import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DishService } from 'src/app/services/dishes/dish.service';
import { MediaService } from 'src/app/services/media/media.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AddTagModalComponent } from '../add-tag-modal/add-tag-modal.component';

@Component({
  selector: 'app-dishes-form',
  templateUrl: './dishes-form.component.html',
  styleUrls: ['./dishes-form.component.scss']
})
export class DishesFormComponent implements OnInit {

  public invalid: boolean = false
  public urlImgListado: any;
  public dishesForm: FormGroup;
  public urlFileListado: File[] = [];
  public uploadProgress!: Observable<number>;
  public isEdit: boolean = false;
  public dish!: any;
  public loading: boolean = false;
  public restaurantId!: string | null;
  public dishId!: string;
  public currentImages: any;
  public tags: any[] = [];
  public actualItems: any[] = [];
  public validatingForm: boolean = false;

  constructor(
    private mediaService: MediaService,
    private dishService: DishService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private tagService: TagsService
  ) {
    this.dishesForm = new FormGroup({
      restaurantID: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('',),
      tags: new FormControl('', Validators.required),
      amount: new FormControl(''),
      photos: new FormControl(''),
    })
   }

   async ngOnInit() {
    if (this.router.url.includes('edit')) {
      this.dishId = this.route.snapshot.paramMap.get("id") ?? '';
      this.setEditState();
    }

    if (this.router.url.includes('create')) {
      this.dishesForm.patchValue({ restaurantID: this.route.snapshot.paramMap.get('id') })
      this.restaurantId = this.route.snapshot.paramMap.get('id');
    }

    this.getTags();
  }

  setEditState() {
    if (this.dishId != '') {
      this.isEdit = true;
      this.getDish();
      this.setEdit(this.dishId);
    }
  }

  async getDish() {
    try {
      let response = await this.dishService.getById(this.dishId);

      if (response.code == 200) {
        this.dishesForm.patchValue(response.data)
        this.actualItems = response.data.images;

      } else {
        this.shootSimpleAlert('error', 'Algo ocurrió al intentar traer la información');
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getTags() {
    try {
      let response = await this.tagService.getTags();
      this.tags = response
    } catch (error) {
      console.log(error);
    }
  }

  async validateForm() {

    this.validatingForm = true;

    if (this.dishesForm.invalid) {
      console.log('invalid');
      console.log(this.dishesForm);


      this.dishesForm.markAllAsTouched();
      // this.shootSimpleAlert('info', 'Todos los campos son obligatorios')
      this.validatingForm = false;
      return;
    }
    this.saveDish()
  }

  openAddTagModal() {
    const dialogRef = this.dialog.open(AddTagModalComponent, {
      width: '30%',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  private async setEdit(dishId: string) {
    try {
      let dishRes: any = await this.dishService.getById(dishId);

      this.dish = dishRes!.data;

      this.dishesForm.patchValue(dishRes.data)
      this.currentImages = dishRes.data.photos;

      // await Promise.all(
      //   dishRes.data.photos.map(async (image: any) => {
      //     this.urlFileListado.push(await this.mediaService.urlToBase64(image.url, image.ref) as File)
      //     return
      //   })
      // )
    } catch (e: any) {
      console.error(e);
      if (e.error.message == 'The user is not owner of the product') this.router.navigateByUrl('/restaurants')
    }
  }

  saveDish() {
    if (this.isEdit) {
      this.editQuestion();
      return
    }
    this.createDish();
  }

  public async editQuestion() {
    Swal.fire({
      title: '¿Está de acuerdo en guardar los cambios?',
      text: 'Los cambios no se podrán regresar a un estado anterior',
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.updateDish();
      }
    })
  }

  async updateDish() {
    try {

      Swal.fire('Guardando...');
      Swal.showLoading();

      let form = this.dishesForm.value;
      this.loading = true;

      // let imageCopy = this.urlFileListado.filter((e: File) => !(e.name.includes(`products/${this.userId}/`)));
      form.photos = await this.mediaService.createImagesList(this.urlFileListado, form.restaurantID);
      form.photos.push(...this.currentImages);

      await this.dishService.update(form, this.dishId);

      this.loading = false;
      Swal.close();

      await Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Platillo editado',
        text: 'El platillo se ha editado con éxito',
        confirmButtonText: 'Entendido',
        customClass: {
          container: "modal-warning"
        }
      })
      this.router.navigateByUrl('restaurants');
    } catch (e) {
      Swal.close();
      console.error(e);
    }
  }

  async createDish() {
    try {
      if(this.urlFileListado.length >0 && this.urlFileListado.length <=5){
        
        this.loading = true;
        let form = this.dishesForm.value;
  
        let itemsImages = await this.mediaService.createImagesList(this.urlFileListado, this.restaurantId);
  
        let dish: any = {
          name: form.name,
          description: form.description,
          price: form.price != '' ? form.price.toString() :null,
          amount: form.amount != '' ? form.amount:null,
          tags: form.tags,
          photos: itemsImages,
          likes: 0,
          restaurantID: form.restaurantID,
          reviews: []
        }
  
        console.log('dish', dish);
        
        await this.dishService.create(dish);
  
     
        this.router.navigate(['/']);
        


      }else{
        if(this.urlFileListado.length > 5){
          this.loading = false;
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Sólo puedes subir 5 imagenes',
            showConfirmButton: true,
          });
        }
        this.loading = false;
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Necesita subir una imagen',
          showConfirmButton: true,
        });
      }
      
      /*this.loading = true;
      let form = this.dishesForm.value;

      let itemsImages = await this.mediaService.createImagesList(this.urlFileListado, this.restaurantId);

      let dish: Dish = {
        name: form.name,
        description: form.description,
        price: form.price != '' ? form.price.toString() : null,
        amount: form.amount != '' ? form.amount : null,
        tags: form.tags,
        photos: itemsImages,
        likes: 0,
        restaurantID: form.restaurantID,
        reviews: []
      }

      console.log('dish', dish);
      
      await this.dishService.create(dish);

   
      this.router.navigate(['/']);
      */

    } catch (e:any) {
      this.loading = false;
      console.error('error:', e);
      if (e.status == 413) {
        this.loading = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El tamaño de las imágenes dentro del contenido excede el límite permitido',
          text: 'Sugerencia: subir imágenes menos pesadas',
          showConfirmButton: true,
        })
      } else {
        this.loading = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Ha ocurrido un error',
          showConfirmButton: true,
        })
      }
    }
  }

  onUploadImageListado(event: any) {
    if (event.addedFiles.length > 5) {
      event.addedFiles.splice(5, (event.addedFiles.length - 5))
    }
    if (this.urlFileListado.length >= 5) {
      this.imgSizeError('Se ha excedido el número maximo de imagenes aceptadas');
      return;
    }
    if (event.rejectedFiles[0]) {
      event.rejectedFiles[0].reason == "size" ? this.imgSizeError('La imagen excede el tamaño permitido (8MB)') : null;
      return;
    }
    this.urlFileListado.push(...event.addedFiles);
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

  onRemoveImageListado(event: any) {
    this.urlFileListado.splice(this.urlFileListado.indexOf(event), 1);
    if (this.isEdit) {
      let index = this.dish.photos?.findIndex((e: any) => e.ref == event.name);
      if (index! > -1) this.dish.photos!.splice(index!, 1);
    }
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

}
