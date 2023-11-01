import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class adminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }


  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const email = this.authService.email; // Assuming authService has a property email
    const password = this.authService.password; // Assuming authService has a property password


    const isAdmin = await this.authService.isUserAdmin(email, password);
    return true
    // if (isAdmin) {
    //   return true; // User is authenticated and an admin, allow access
    // } else {
    //   console.log("isAdmin", isAdmin)
    //   this.router.navigate(['']); // Redirect to the login page
    //   return false; // Deny access
    // }
  }
}