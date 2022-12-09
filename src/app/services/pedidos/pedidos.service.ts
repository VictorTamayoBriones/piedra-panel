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
export class PedidosService {
  
  private PEDIDOS_URI: string = `${environment.URL_API}/pedido/`;

  constructor(
    private http: HttpClient
  ) { }

  async create(dish: any) {
    try {
      let response = await this.http.post<SimpleResponse>(this.PEDIDOS_URI + 'create', { dish }).toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getAll() {
    try {
      let response: any = await this.http.get<Response>(this.PEDIDOS_URI + 'get-all').toPromise();
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getByKeyValue(obj: any) {
    try {
      let dishes: any = await this.http.post<Response>(this.PEDIDOS_URI + 'get-by-key-value', {obj}).toPromise();
      return dishes
    } catch (error) {
      console.log(error);
      throw error
    }
  }  
}
