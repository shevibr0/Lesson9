import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent {

  constructor(private route: ActivatedRoute, private productService: FirebaseService, private firestore: AngularFirestore) {
  }
  product: any = {}
  products: any[] = [];
  purchases: any[] = [];
  customerId: string = "";
  products1: any[] = []

  ngOnInit() {
    this.customerId = this.route.snapshot.params['id'];; // Replace with the actual customer ID

    this.productService.getCustomerPurchases(this.customerId).subscribe((purchases: any[]) => {
      this.purchases = purchases;


      console.log('Customer purchases:', this.purchases);
      let productIds: any[] = []
      productIds = this.purchases.map((purchase) => purchase.ProductID);
      console.log("productIds", productIds)
      const products: any = [];
      for (const productId of productIds) {
        interface Product {
          id: string; // Replace with the appropriate data types for your product fields
          name: string;
          price: number;
          quantity: number;
          // Add other fields as needed
        }

        // Use the interface when calling the function
        this.productService.findProductById(productId)
          .then((product: Product | null) => {
            if (product !== null) {
              // You can safely access properties of the product
              console.log('Product Name:', product.name);
              console.log('Product Price:', product.price);
              // ...
              products.push(product);
              this.products1 = products;
              console.log('Products1111:', this.products1);
            } else {
              console.error('Product not found');
            }
          })
          .catch((error) => {
            console.error('Error fetching product:', error);
          });


      }

    })
  }

  // findProductById(productId: string): any {
  //   // Sample product data (replace with your actual product data)
  //   const Products: any[] =[]
  //   // Search for the product by ID in the sample product data
  //   this.products1 = Products.find((product: any) => product.id === productId);
  //   console.log("this.products1", this.products1);

  // }

}



