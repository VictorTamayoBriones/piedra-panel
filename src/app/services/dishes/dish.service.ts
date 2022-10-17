import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

export interface SimpleResponse {
  code: number
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class DishService {

  private DISHES_URI: string = `${environment.URL_API}/dishes/`;

  constructor(
    private http: HttpClient
  ) { }

  async create(dish: any) {
    try {
      let response = await this.http.post<SimpleResponse>(this.DISHES_URI + 'create', { dish }).toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getAll() {
    try {
      let response: any = await this.http.get<Response>(this.DISHES_URI + 'get-all').toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getByKeyValue(obj: any) {
    try {
      let dishes: any = await this.http.post<Response>(this.DISHES_URI + 'get-by-key-value', {obj}).toPromise();
      return dishes
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async update(data: any, id: string) {
    try {
      let response = await this.http.post<SimpleResponse>(this.DISHES_URI + 'update', { data, id }).toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getById(id: string) {
    try {
      let response: any = await this.http.post<Response>(this.DISHES_URI + 'get-by-id', { id }).toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async delete(id: string) {
    try {
      let response = await this.http.post<SimpleResponse>(this.DISHES_URI + 'delete', { id }).toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
