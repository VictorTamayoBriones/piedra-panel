import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DishesService } from 'src/app/services/dishes-services/dishes.service';
import { RestaurantesService } from 'src/app/services/restaurantes/restaurantes.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-dishes-table',
  templateUrl: './dishes-table.component.html',
  styleUrls: ['./dishes-table.component.scss']
})
export class DishesTableComponent implements OnInit {

  @Input() item: any;
  
  public dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'description','price', 'photo', 'actions'];

  public loading: boolean = false;
  public restaurantID: string = '';
  public dishes: any[] = [];

  constructor(
    private router: Router,
    private dishService: DishesService,
    private restaurantService: RestaurantesService
  ) { }

  ngOnInit(): void {
  }

  async ngOnChanges(changes: SimpleChanges) {
    if( this.item != null){
      this.restaurantID = this.item._id
      this.getDishesByRestaurant();    
    }
  }

  async getDishesByRestaurant() {
    try {
      let obj = {
        restaurantID: this.restaurantID
      }
      let response = await this.dishService.getByKeyValue(obj)
      this.dishes = response.data.dishes
      
      console.log(this.dishes);
      

      this.dataSource = new MatTableDataSource(this.dishes);

    } catch (error) {
      console.log(error);
      
    }
  }

  shootSimpleAlert(icon: SweetAlertIcon, title: string, text?: string) {
    Swal.fire({
      position: 'center',
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: true,
    });
  }
  
  updateDish(dishId: string){
    this.router.navigate([`/dishes-form/edit/${dishId}`])
  }

  async deleteDish(element: any) {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar este platillo? Esta acción es irreversible',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response = await this.dishService.delete(element._id);
          
          if(response?.code == 200) {
            this.shootSimpleAlert('success', 'platillo eliminado correctamente');
          }
          
        } catch (error) {
          console.log(error);
          throw error
        }
      }
    })
  }

  async deleteRestaurant(element: any){
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar este restaurante? Esta acción es irreversible',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response = await this.restaurantService.delete(element);
          
          if(response?.code == 200) {
            this.shootSimpleAlert('success', 'Restaurante eliminado correctamente!');
            // this.getDishesByRestaurant();
            window.location.reload()
          }
          
        } catch (error) {
          console.log(error);
          throw error
        }
      }
    })
  }

}
