// import { CanActivate } from '@angular/router';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { AuthService } from './auth.service'; // You should have an AuthService to manage authentication

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) { }

// canActivate(): boolean {
//   if (this.authService.isAuthenticated()) {
//     return true; // User is authenticated, allow access
//   } else {
//     this.router.navigate(['']); // Redirect to the login page
//     return false; // Deny access
//   }
// }
// };
