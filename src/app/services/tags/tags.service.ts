import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface SimpleResponse {
  code: number
  message: string
}

export interface Response {
  code: number
  message: string 
  data: any
}

@Injectable({
  providedIn: 'root'
})

export class TagsService {

  private TAGS_URI: string = `${environment.URL_API}/tag/`

  constructor(
    private http: HttpClient
  ) { }

  async createTag(data: string){
    try {
      let response = await this.http.post<SimpleResponse>(this.TAGS_URI + 'create', { data }).toPromise()
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getTags(){
    try {
      let response =  await this.http.get<Response>(this.TAGS_URI + 'get-all').toPromise()
      return response?.data as Array<any>
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getTagsById(id: string){
    try {
      let response =  await this.http.get<Response>(this.TAGS_URI + 'get-by-id').toPromise()
      return response?.data as any
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async deleteTag(id: string){
    try {
      let response = await this.http.post<SimpleResponse>(this.TAGS_URI + 'delete', { id }).toPromise()
      return response?.code
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
