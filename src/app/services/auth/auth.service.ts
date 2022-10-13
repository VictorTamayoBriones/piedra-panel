import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { first } from 'rxjs';

interface Authenticated {
  res?: boolean;
  user?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firebase: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
  ) { }

  async isAuthenticated(): Promise<Authenticated> {
    const user = await this.isLoggedIn();
    if (user) {
      // console.log("logged in");
      
      return { res: true, user: user.uid };
    } else {
      return { res: false };
    }
  }

  async getUser(uid: string){
    try {
      const user = await this.firebase.collection('admins').doc(uid).get().toPromise();
      return user?.data() as any;
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async isLoggedIn() {
    return await this.auth.authState.pipe(first()).toPromise();
  }


  async login(email: string, password: string) {
    try {
      const userSnapshot = await this.firebase.collection('admins', (ref) => ref.where('email', '==', email)).get().toPromise();
      if (userSnapshot!.empty) {
        throw { error: true, message: "No existe una cuenta con el correo ingresado." };
      }
      const sigInSnapshot = await this.auth.signInWithEmailAndPassword( email, password );
      if (!sigInSnapshot.user) {
        throw false;
      }
      return this.router.navigate(['login']);
    } catch (error: any) {
      console.log(error);
      let errorMessage;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No existe una cuenta creada con el correo ingresado"
          break;
        case "auth/invalid-email":
          errorMessage = "Correo electrónico incorrecto"
          break;
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta"
          break;
        case "auth/invalid-password":
          errorMessage = "Contraseña inválida"
          break;
        default:
          break;
      }

      if (error.code == undefined) {
        errorMessage = "No existe una cuenta con el correo ingresado."
      }

      throw { error: true, message: errorMessage };
    }
  }

  public async loginWithEmailAndPassword(email: string, password: string) {
    try {
      return await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  }
  async logout(): Promise<any> {
    try {
      return await this.auth.signOut();
    } catch (error) {
      throw error;
    }
  }
}
