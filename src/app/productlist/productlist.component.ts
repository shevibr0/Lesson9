import { Component, QueryList, ViewChild } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsComponent } from '../products/products.component';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent {
  product: number = 0
  products: any[] = [];
  customers: any[] = []
  purchases: any[] = []
  totalAmount: number = 0;
  isAddProductVisible = false
  selectedProduct: any
  selectedCustomer: any
  selectedCustomerToAdd: any = null;
  purchaseAdded: boolean = false;
  selectedCustomerIndex: number = 0
  purchaseMessage: string = '';
  isAddingProduct: boolean = false
  selectedCustomerToShow: boolean = false
  showSectionOnInit: boolean = true
  userToUpdate: string = "Dana"
  name: string = ""
  age: number = 0
  users: any[] = []
  constructor(private fb: FirebaseService) {

  }
  @ViewChild(ProductsComponent)
  region1: any

  addProductToCustomer(customer: any) {
    customer.isAddingProduct = !customer.isAddingProduct;
  }


  createPurchaseForCustomer(customer: any) {

    if (!customer || !customer.selectedProduct) {
      console.error('Invalid customer or selected product:', customer);
      return;
    }

    const customerId = customer.id;
    const productId = customer.selectedProduct.id; // Get the product ID from the selectedProduct


    // Create a new purchase record
    const newPurchase = {
      CustomerID: customerId,
      ProductID: productId,
      Date: new Date() // Set the purchase date to the current date
    };

    // Check if the product exists
    const selectedProduct = this.products.find(product => product.id === productId);
    console.log(productId)
    if (selectedProduct) {
      // The product exists, so you can proceed with updating its quantity.
      this.fb.updateProductQuantity(productId, 1).subscribe(() => {
        console.log('Product quantity updated successfully.');
        // Create the new purchase record in the "Purchases" collection
        this.fb.createPurchase(newPurchase).then(() => {
          // Increment the totalAmount
          this.totalAmount = this.totalAmount + 1;
          console.log("now", this.totalAmount)
          this.region1.totalAmount = this.totalAmount
        }).catch((error) => {
          console.error('Error creating purchase:', error);
        });
      });
    } else {
      console.error(`Product with ID ${productId} does not exist.`);
    }
  }



  ngOnInit() {
    // Combine data from different collections
    combineLatest([
      this.fb.getAllProducts(),
      this.fb.getAllCustomers(),
      this.fb.getAllPurchases()
    ])
      .pipe(
        map(([productData, customerData, purchaseData]) => {
          const products = productData.map((user: any) => ({
            id: user.payload.doc.id,
            ...user.payload.doc.data()

          }

          ));
          console.log("ssssssssssssssssssssssssssssssssss")
          const customers = customerData.map((user: any) => ({
            id: user.payload.doc.id,
            ...user.payload.doc.data()
          }));

          const purchases = purchaseData.map((user: any) => ({
            id: user.payload.doc.id,
            ...user.payload.doc.data(),
            isAddingProduct: false,

          }));
          this.totalAmount = purchases.length;
          let totalAmount1 = this.totalAmount
          this.region1.totalAmount = totalAmount1
          console.log("products.length", this.totalAmount)
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
          this.purchases = purchases


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
