import { Component, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Observable, catchError, from, tap, throwError } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent {
  constructor(private customerService: FirebaseService,private route: ActivatedRoute) { }
  customer: any = {}
  @Input()
  customerId: string = "";
  updatedCustomerFirstName: string = "";
  updatedCustomerLastName: string = "";
  updatedCustomerCity: string = "";
  purchases: any[] = []
  customers: any[] = []
  products: any[] = []
productId:string=""
  product: any = {}

  updateCustomer() {
    const updatedCustomerData = {
      FirstName: this.updatedCustomerFirstName,
      LastName: this.updatedCustomerLastName,
      city: this.updatedCustomerCity,
    };

    this.customerService.updateCustomer(this.customerId, updatedCustomerData)
      .then(() => {
        console.log('Product updated successfully');
      })
      .catch((error: any) => {
        console.error('Error updating product:', error);
      });
  }
  deleteCustomer(customerId: string): Observable<void> {
    // Use from to convert the Promise into an Observable
    return from(this.customerService.deleteCustomer(customerId)).pipe(
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
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const customerId = params.get('id'); // Assuming the route parameter is named 'id'

      if (customerId) {
        // Call a function to fetch the customer details from Firebase
        this.getCustomerDetails(customerId);
      }
    });
  }

  getCustomerDetails(customerId: string) {
    // Use your Firebase service to fetch the customer details
    this.customerService.getCustomerById(customerId).subscribe((customer) => {
      if (customer) {
        this.customer = customer;
        this.updatedCustomerFirstName=this.customer.FirstName;
        this.updatedCustomerLastName=this.customer.LastName;
        this.updatedCustomerCity=this.customer.city // Set the customer object with the retrieved data
      }
    });
  
    // Combine data from different collections
    combineLatest([
      this.customerService.getAllProducts(),
      this.customerService.getAllCustomers(),
      this.customerService.getAllPurchases()
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
          products.forEach((product: any) => {
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
