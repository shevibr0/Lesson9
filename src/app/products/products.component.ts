import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common'
import { Routes } from '@angular/router';
import { ProductlistComponent } from '../productlist/productlist.component';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent {

  totalAmount:number = 0;

 
 

}
