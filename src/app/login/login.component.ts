import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = "";
  password: string = "";

  constructor(private auth: AngularFireAuth, private router: Router) { }

  async login() {
    const emailValue = this.email;
    const passwordValue = this.password;
    try {
      // const userCredential = await this.auth.signInWithEmailAndPassword(emailValue, passwordValue);
      // Authentication successful; navigate to the user's dashboard or another route
      //console.log("userCredential", userCredential)
      this.router.navigate(['/menu']);
    } catch (error) {
      // Handle login error (e.g., display a message to the user)
      console.error('Login error:', error);

    }
  }
}
