import { Component, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Observable, catchError, from, tap, throwError } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-product-form-component',
  templateUrl: './product-form-component.component.html',
  styleUrls: ['./product-form-component.component.css']
})
export class ProductFormComponentComponent {
  constructor(private productService: FirebaseService,private route: ActivatedRoute) { }
  
  customer:any={};
  customerId:string=""
  @Input()
  productId: string = "";
  product:any={}
  updatedProductName: string = "";
  updatedProductPrice: number = 0;
  updatedProductQuantity: number = 0;
  customers: any[] = []
  products: any[] = []
  purchases: any[] = []


 
  
  updateProduct() {
    console.log("this.productId", this.productId)
    const updatedProductData = {
      Quantity: this.updatedProductQuantity,
      name: this.updatedProductName,
      price: this.updatedProductPrice,
    };

    this.productService.updateProduct(this.productId, updatedProductData)
      .then(() => {
        console.log('Product updated successfully');
      })
      .catch((error: any) => {
        console.error('Error updating product:', error);
      });
  }


  deleteProduct(productId: string): Observable<void> {
    // Use from to convert the Promise into an Observable
    return from(this.productService.deleteProduct(productId)).pipe(
      // Handle the success case
      tap(() => {
        console.log('Product deleted successfully');
      }),
      // Handle errors
      catchError((error: any) => {
        console.error('Error deleting product:', error);
        return throwError(error);
      })
    );
  }
  ngOnInit()  {
  this.route.paramMap.subscribe(params => {
    this.customer = params.get('id');
  });

  console.log('Customer ID:', this.customerId); // Check the value in the console.

    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id'); // Assuming the route parameter is named 'id'

      if (productId) {
        // Call a function to fetch the customer details from Firebase
        this.getProductDetails(productId);
      }
    });
  }
  getProductDetails(productId: string) {
    // Use your Firebase service to fetch the customer details
    this.productService.getProductById(productId).subscribe((product) => {
      if (product) {
        this.product = product;
        this.updatedProductName=this.product.name;
        this.updatedProductPrice=this.product.price;
        this.updatedProductQuantity=this.product.Quantity // Set the customer object with the retrieved data
      }
    });
  
    // Combine data from different collections
    combineLatest([
      this.productService.getAllProducts(),
      this.productService.getAllCustomers(),
      this.productService.getAllPurchases()
    ])
      .pipe(
        map(([productData, customerData, purchaseData]) => {
          const products = productData.map((user: any) => ({
            id: user.payload.doc.id,
            ...user.payload.doc.data()
          }
          ));
          const customers = customerData.map((user: any) => ({
            id: user.payload.doc.id,
            ...user.payload.doc.data()
          }));

          const purchases = purchaseData.map((user: any) => ({
            id: user.payload.doc.id,
            ...user.payload.doc.data()

          }));

          // Combine data as needed
          this.products.forEach((product: any) => {
            product.Customers = this.getCustomersForProduct(
              product.id,
              purchases,
              customers
            );

            return product;
          });

          this.products = products;
          this.purchases = purchases;
          this.customers = customers;


        })
      )
      .subscribe(() => {
        this.products.forEach((product) => {
          console.log(`Product: ${product.name}`);
          if (product.Customers) {
            console.log(`Customers who bought this product:`);
            product.Customers.forEach((customer: any) => {
              // console.log(
              //   `Customer: ${customer.FirstName} ${customer.LastName}, Purchase Date: ${customer.Date}`
              // );
            });
          }
        });
      });

  }

  getCustomersForProduct(productId: string, purchases: any[], customers: any[]) {
    const productPurchases = purchases.filter(
      (purchase) => purchase.ProductID === productId
    );

    const customerData = [];

    for (const purchase of productPurchases) {
      const customer = customers.find((c) => c.id === purchase.CustomerID);
      if (customer) {
        const purchaseDate = (purchase.Date as Timestamp).toDate(); // Convert Timestamp to Date
        customerData.push({
          ...customer,
          Date: purchaseDate
        });
      }
    }

    return customerData;
  }

}
