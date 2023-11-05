import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from } from 'rxjs';


@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent {

  constructor(private route: ActivatedRoute, private productService: FirebaseService, private firestore: AngularFirestore) {
  }
  productId:string=""
  product: any = {}
  products: any[] = [];
  purchases: any[] = [];
  customerId: string = "";
  products1: any[] = []
  Products: any[]=[]
  productDetailsLoaded = false;

  ngOnInit() {
   
      this.customerId = this.route.snapshot.params['id']; // Replace with the actual customer ID

    this.productService.getCustomerPurchases(this.customerId).subscribe((purchases: any[]) => {
      this.purchases = purchases;

      const productIds: any[] = this.purchases.map((purchase) => purchase.ProductID);

      // Fetch product details from Firebase based on product IDs
      this.fetchProductDetails(productIds);
    });
  }

  fetchProductDetails(productIds: string[]): void {
    const productObservables: Observable<any>[] = [];

    for (const productId of productIds) {
      const productObservable = from(this.productService.findProductById(productId));
      productObservables.push(productObservable);
    }

    forkJoin(productObservables).subscribe((products: any[]) => {
      this.products1 = products;
      console.log("this.products1", this.products1);
      
    
      
    })
  }
  
 }



