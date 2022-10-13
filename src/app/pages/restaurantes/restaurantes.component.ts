import { Component, OnInit } from '@angular/core';
import { RestaurantesService } from 'src/app/services/restaurantes/restaurantes.service';

@Component({
  selector: 'app-restaurantes',
  templateUrl: './restaurantes.component.html',
  styleUrls: ['./restaurantes.component.scss']
})
export class RestaurantesComponent implements OnInit {

  term: any;
  restaurants: any = [];

  constructor(
    private restaurantService: RestaurantesService
  ) { }

  ngOnInit(): void {
    this.getRestaurants();
  }

  async getRestaurants() {
    try {
      let response = await this.restaurantService.getAll();
      
      if(response.code == 200) {
        this.restaurants = response.data
      }

    } catch (error) {
      console.log(error);
      throw error
    }
  }

}
