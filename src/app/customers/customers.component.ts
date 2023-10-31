import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
customers:any[]=[]
customerProducts1:any[]=[]
products: any[] = [];
dates:any[]=[]
showPurchaseForm = false;
selectedProductId: string | null = null;
selectedCustomerId: string | null = null;
constructor(private customerService: FirebaseService){}

ngOnInit() {
  combineLatest([
    this.customerService.getAllCustomers(),
    this.customerService.getAllPurchases(),
    this.customerService.getAllProducts()
  ])
    .pipe(
      map(([customerData, purchaseData, productData]) => {
        const customers = customerData.map((customer: any) => ({
          id: customer.payload.doc.id,
          ...customer.payload.doc.data()
        }));

        const purchases = purchaseData.map((purchase: any) => ({
          id: purchase.payload.doc.id,
          ...purchase.payload.doc.data()
        }));

        const products = productData.map((product: any) => ({
          id: product.payload.doc.id,
          ...product.payload.doc.data()
        }));
        this.products=products

        // Create a data structure to associate customers with their purchased products
        const customerProducts = this.getCustomerProducts(customers, purchases, products);

        this.customers = customers.map((customer) => ({
          ...customer,
          boughtProducts: customerProducts[customer.id] || []
        }));
      })
    )
    .subscribe(() => {
      console.log('Customers and their purchased products:', this.customers);
    });
}

getCustomerProducts(customers: any[], purchases: any[], products: any[]) {
  const customerProducts: Record<string, any[]> = {};

  for (const purchase of purchases) {
    const customerId = purchase.CustomerID;
    const productId = purchase.ProductID;

    if (!customerProducts[customerId]) {
      customerProducts[customerId] = [];
    }

    const product = products.find((p) => p.id === productId);
    if (product) {
      customerProducts[customerId].push({
        id: product.id,
        name: product.name,
        date: purchase.Date.toDate() // Convert Timestamp to Date
      });
    }
  }
  return customerProducts;
}
openPurchaseForm(customerId: string) {
  this.showPurchaseForm = true;
  this.selectedCustomerId = customerId;
}

purchaseProduct(customerId:string) {
  if (this.selectedProductId) {

    // Get the current date
    const currentDate = new Date();

    // Add the purchase to the "Purchases" collection using your Firebase service
    this.customerService.addPurchase({
      ProductID: this.selectedProductId,
      CustomerID: customerId,
      Date: currentDate
    }).then(() => {
      // Purchase added successfully
      console.log('Product purchased successfully');
      
      // After a successful purchase, close the form and reset the selected product
      this.showPurchaseForm = false;
      this.selectedProductId = null;
    }).catch((error:any) => {
      console.error('Error purchasing the product:', error);
    });
  
}
}}