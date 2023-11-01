import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common'; 
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MenuComponent } from './menu/menu.component';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { PurchasesComponent} from './purchases/purchases.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { FormsModule } from '@angular/forms';
import { ProductFormComponentComponent } from './product-form-component/product-form-component.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { adminGuard } from './admin.guard'
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
const appRoutes:Routes=[
  {path:'menu', component:MenuComponent},
  {path:'admin-dashboard',component: AdminDashboardComponent,canActivate: [adminGuard]},
  {path:'', component:LoginComponent},
  {path: 'not-authorized', component: NotAuthorizedComponent },
  {path:'Products', component:ProductlistComponent, canActivate: [AuthGuard]},
   {path:'Customers', component:CustomersComponent,canActivate: [AuthGuard]},
  {path:'Purchases', component:PurchasesComponent,canActivate: [AuthGuard]},
  {path:'EditCustomer/:id', component:EditCustomerComponent,canActivate: [AuthGuard, adminGuard]},
  {path:'EditCustomer/:id/EditProduct', component:EditProductComponent, canActivate: [AuthGuard, adminGuard]},
  {path:'Products/EditProduct/:id', component:EditProductComponent,canActivate: [AuthGuard, adminGuard]}
  
 ]
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ProductsComponent,
    CustomersComponent,
    PurchasesComponent,
    EditProductComponent,
    EditCustomerComponent,
    ProductlistComponent,
    ProductFormComponentComponent,
    CustomerFormComponent,
    LoginComponent,
    AdminDashboardComponent,
    NotAuthorizedComponent,
  
  ],
  imports: [
    BrowserModule,
    AngularFirestoreModule,
    FormsModule,
    CommonModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(
      { apiKey: "AIzaSyCt3SCOzN1vlSOLv-teCkI8iof7MR3ITMU",
        authDomain: "website-for-managing-a-store.firebaseapp.com",
        projectId: "website-for-managing-a-store",
        storageBucket: "website-for-managing-a-store.appspot.com",
        messagingSenderId: "853811771380",
        appId: "1:853811771380:web:98fa2efafca1334b4deba1"
      }
    ),
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule
  ],
  providers: [AuthGuard, adminGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
