import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface SimpleResponse {
  code: number
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantesService {

  private RESTAURANT_URI: string = `${environment.URL_API}/restaurants/`;

  constructor(
    private http: HttpClient
  ) { }

  async create(restaurant: any) {
    try {
      let response = await this.http.post<SimpleResponse>(this.RESTAURANT_URI + 'create', { restaurant }).toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getAll() {
    try {
      let response: any = await this.http.get<Response>(this.RESTAURANT_URI + 'get-all').toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getByKeyValue(obj: { userId: string }) {
    try {
      let policies: any = await this.http.post<Response>(this.RESTAURANT_URI + 'get-by-key-value', { obj }).toPromise();
      return policies
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async update(data: any, id: string) {
    try {
      let response = await this.http.post<SimpleResponse>(this.RESTAURANT_URI + 'update', { data, id }).toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getById(id: string) {
    try {
      let response: any = await this.http.post<Response>(this.RESTAURANT_URI + 'get-by-id', { id }).toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async delete(id: string) {
    try {
      let response = await this.http.post<SimpleResponse>(this.RESTAURANT_URI + 'delete', { id }).toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

}
