import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {

  private addURL: string = `${environment.URL_API}/admins/create`;
  private updateURL: string = `${environment.URL_API}/admins/update`;
  private deleteURL: string = `${environment.URL_API}/admins/delete`;


  constructor(private http: HttpClient, private firebase: AngularFirestore) { }
  async adminExist(email: string): Promise<boolean> {
    const userSnapshot = await this.firebase
      .collection('admins', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise();

    if (userSnapshot?.empty) {
      return false;
    }
    return true;
  }

  async add(form: any) {
    try {
      const answer = await this.http
        .post<{ code: number; message: string }>(`${this.addURL}`, {
          data: form,
        })
        .toPromise();
      return answer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async update(form: any) {
    try {
      const answer = await this.http
        .post<{ code: number; message: string }>(`${this.updateURL}`, {
          data: form,
        })
        .toPromise();
      return answer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async delete(userId: any) {
    try {
      const answer = await this.http
        .post<{ code: number; message: string }>(`${this.deleteURL}`, {
          uid: userId,
        })
        .toPromise();
      return answer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
