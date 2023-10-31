import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
customers:any[]=[]
constructor(private customerService: FirebaseService){}

ngOnInit() {
  this.customerService.getAllCustomers().subscribe((customers: any[]) => {
    this.customers = customers;
  });
}
}
