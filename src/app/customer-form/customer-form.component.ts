import { Component, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Observable, catchError, from, tap, throwError } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent {
  constructor(private productService: FirebaseService) { }
  @Input()

  customerId: string = "";
  updatedCustomerFirstName: string = '';
  updatedCustomerLastName: string = '';
  updatedCustomerCity: string = '';
  purchases: any[] = []
  customers: any[] = []
  products: any[] = []


  updateCustomer() {
    const updatedCustomerData = {
      FirstName: this.updatedCustomerFirstName,
      LastName: this.updatedCustomerLastName,
      city: this.updatedCustomerCity,
    };

    this.productService.updateCustomer(this.customerId, updatedCustomerData)
      .then(() => {
        console.log('Product updated successfully');
      })
      .catch((error: any) => {
        console.error('Error updating product:', error);
      });
  }
  deleteCustomer(customerId: string): Observable<void> {
    // Use from to convert the Promise into an Observable
    return from(this.productService.deleteCustomer(customerId)).pipe(
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
