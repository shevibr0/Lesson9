import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { first, catchError, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { throwError } from 'rxjs';

interface UserData {
  admin: boolean;
  // Add other properties if needed
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  email: string = ""; // Add an email property
  password: string = ""; // Add a password property

  user: Observable<firebase.default.User | null>;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user = afAuth.authState;
  }

  async isUserAdmin(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await this.login(email, password);
    console.log("userCredential",userCredential)
    
      if (userCredential && userCredential.user) {
        // Fetch the user's admin status from Firestore
        const userDoc = await this.firestore.collection('users').doc(userCredential.user.uid).get().toPromise();
        
        if (userDoc && userDoc.exists) {
          const userData = userDoc.data() as UserData;
          console.log("userData",userData)
          return userData.admin === true;
         
        } else {
          console.error('User document not found');
          return false;
        }
      } else {
        console.error('User not authenticated');
        return false;
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
  isAuthenticated(): boolean {
    return !!this.afAuth.currentUser;
  }
  setCredentials(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
  login(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    console.log("login success")
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
