import { Component, Output,EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {
  @Output()
   selectedProductChange = new EventEmitter<any>();
  // ...

  // When a product is selected, call this method and emit the selected product
  onProductSelected(product: any) {
    this.selectedProductChange.emit(product);
  }
  products: any[] = []
  productId: string = "";
  constructor(private route: ActivatedRoute) {
    this.productId = this.route.snapshot.params['id'];
    console.log("this.productId params", this.productId)
  }


ngOnInit(){
  this.productId = this.route.snapshot.params['id']; 
  console.log("thiss",this.productId)
}
}
