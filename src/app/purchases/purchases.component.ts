import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Timestamp } from 'firebase/firestore';
import { combineLatest, map } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/firestore';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent {
  customers: any[] = [];
  products: any[] = [];
  selectedCustomer: string = "";
  selectedProduct: string = "";
  selectedDate: string = "";
  searchResults: any[]=[];
  allPurchases:any[]=[]

  constructor(private purchaseService: FirebaseService) {}


    
  ngOnInit() {
    // Combine data from different collections
    combineLatest([
      this.purchaseService.getAllProducts(),
      this.purchaseService.getAllCustomers(),
      this.purchaseService.getAllPurchases()
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
            ...user.payload.doc.data(),
            isAddingProduct: false,
            
          }));
        
        
          // Combine data as needed
          products.forEach((product) => {
            product.Customers = this.getCustomersForProduct(
              product.id,
              purchases,
              customers
            );
          
            return product;
          });
         
          this.products = products;
         this.customers=customers;
         this.allPurchases=purchases;
        
         
        })
      )
      .subscribe(() => {
        this.products.forEach((product) => {
          console.log(`Product: ${product.name}`);
          if (product.Customers) {
            console.log(`Customers who bought this product:`);
            product.Customers.forEach((customer:any) => {
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
  }
  searchPurchases() {
    // Initialize an empty array to store the search results
    const results: any[] = [];
  
    // Iterate through all purchases
    for (const purchase of this.allPurchases) {
      // Find the corresponding customer and product
      const customer = this.customers.find((c) => c.id === purchase.CustomerID);
      const product = this.products.find((p) => p.id === purchase.ProductID);
  
      // Check if the selected customer matches or none is selected
      const customerMatches = !this.selectedCustomer || customer.id === this.selectedCustomer;
  
      // Check if the selected product type matches or none is selected
      const productMatches = !this.selectedProduct || product.id === this.selectedProduct;
  
      // Parse the selected date as a JavaScript Date object
      const selectedDate = this.selectedDate ? new Date(this.selectedDate) : null;

if (selectedDate instanceof Date ) {
  // Convert the selected date to the format used by Firebase Timestamp
  const formattedSelectedDate = `${selectedDate.getMonth() + 1}-${selectedDate.getDate()}-${selectedDate.getFullYear()}`;

  // Convert the Firebase Timestamp to the same format
  const formattedPurchaseDate = `${purchase.Date.toDate().getMonth() + 1}-${purchase.Date.toDate().getDate()}-${purchase.Date.toDate().getFullYear()}`;

  // Check if the formatted dates match or if the selected date is empty
  const dateMatches = !this.selectedDate || formattedSelectedDate === formattedPurchaseDate;

  
      // If all criteria match, add the purchase details to the results array
      if (customerMatches && productMatches && dateMatches) {
        results.push({
          customerName: customer.FirstName,  // You can include other details if needed
          productName: product.name,
          purchaseDate: selectedDate,
        });
      }
    }
   }
    // Assign the results to the searchResults array for display in the table
    this.searchResults = results;
    console.log("this.searchResults",this.searchResults)

  }
}
