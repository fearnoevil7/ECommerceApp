import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { from } from 'rxjs';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Location } from '@angular/common';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {
  id: {};
  userid: number;
  productId: number;
  productId2: string;
  productToUpdate: {};
  product_name: string;
  product_quantity: number;
  product_description: string;
  product_category: string;
  product_price: number;
  product_image: string;
  current_product: any;

  detailsBox: string;

  ToIncrement: boolean = true;
  ToDecrement: boolean = false;

  desiredquantity = 1;

  paginatedPages: [];

  ReviewButtonToggle: boolean = false;

  stars = [1, 2, 3, 4, 5];

  newReview: any;

  hoverState = 0;

  ReviewContentLabel = `Fill Out Content`;

  ReviewContentLabelArray: {};

  SplitLabel = "";

  Reviews: any;

  user: any;
  shoppingcart2 = [];
  CartCount: number;

  constructor(
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
    this._router.params.subscribe((params: Params) => {
      this.productId = params['id'];
      this.productId2 = params['id'];
    });
    this.getProductFromService(this.productId);
    console.log(this.productId);
    this.newReview = { Content: null, Rating: null, ReviewerId: parseInt(this.id['id']), ProductId: parseInt(this.productId2) };
    console.log("newReview", this.newReview);
    this.detailsBox = 'Additional Info';
    this.getAllReviews();
    this.isUserAuthenticated();
    this.currentUser();
    //this.ReviewContentLabelArray = this.ReviewContentLabel.split('').map((letter) => `<span>${letter}</span>`);

    //for (var i = 0; i < this.ReviewContentLabel.length; i++) {
    //  console.log(this.ReviewContentLabel[i]);
      
    //  var letter = `<span>${this.ReviewContentLabel[i]}</span>`;

    //  console.log(letter);

    //  this.SplitLabel = this.SplitLabel.concat(letter);

    //}

    //console.log(this.ReviewContentLabelArray);

    //console.log(this.SplitLabel);


  }



  isUserAuthenticated() {
    let token: string = localStorage.getItem("token");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.id = { id: this.jwtHelper.decodeToken(token).nameid };
      this.userid = parseInt(this.jwtHelper.decodeToken(token).nameid, 10);
      console.log("*******!!!!!!!!********!!!!!!!!", this.id);
      console.log("*******!!!!!!!!********!!!!!!!!", this.jwtHelper.decodeToken(token));
      return true;
    } else {
      return false;
    }
  }


  getProductFromService(productid: number) {
    let observable = this._httpService.getProduct(productid);
    observable.subscribe(data => {
      this.productToUpdate = data['Product'];
      this.product_name = this.productToUpdate['Name'];
      this.product_quantity = this.productToUpdate['Quantity'];
      this.product_description = this.productToUpdate['Description'];
      this.product_category = this.productToUpdate['Category'];
      this.product_price = this.productToUpdate['Price'];
      this.current_product = data['Product'];
      console.log("Got our product!!!", this.productToUpdate);
      console.log("Testing 123 Testing 123!!!!", this.current_product);
      this.product_image = this.current_product['ImageUrl'];

    });
  }

  addToCart(productId: number) {
    //console.log("********SuperTest*******", this.productId);

    let observable = this._httpService.checkInventory(productId, Math.abs(this.desiredquantity), this.userid);
    observable.subscribe(data => {
      console.log(data);
      this._route.navigate(["/admin/order"]);
      this._route.navigate(["/admin/order"]);
      this.paginatedPages = JSON.parse(window.localStorage.getItem("pagination"));
      window.localStorage.setItem("admin-order-killswitch", 'false');
      location.reload();

      //this.ReturnToPage();
      //this.CustomerCart.push({ productid: this.productId, quantity: this.quantity1, vendorId: data['VendorId'], lastName: data['VendorLastName'], firstName: data['VendorFirstName'], email: data['VendorEmail'] });
      //console.log("****CustomerCartLog********");
      //console.log(this.CustomerCart);

    })
  }

  adjustQuantity(IncrementOrDecrement: boolean) {
    if (IncrementOrDecrement == true) {
      this.desiredquantity += 1;
    } else {
      this.desiredquantity -= 1;
    }
  }

  NavigateDetailsBox(Tab: string) {

    this.detailsBox = Tab;
    console.log("TAB TEST!!!!!!!!", Tab);

  }

  RevealReviewBtn(status: boolean) {
    this.ReviewButtonToggle = true;
  }

  onStarEnter(starId: number) {
    this.hoverState = starId;
  }

  onStarLeave() {
    this.hoverState = 0;
  }

  onStarClicked(starId: number) {
    this.newReview['Rating'] = starId;
    console.log("onStarClicked Event Initiated in the show-product Component!!!!!", this.newReview);
  }

  ReviewSectionAnimate(animate: boolean) {
    if (animate == true) {
      this.ReviewButtonToggle = true;
      this.ReviewContentLabel = this.SplitLabel;
      console.log("TRUE");
    } else {
      this.ReviewButtonToggle = false;
      this.ReviewContentLabel = "Fill Out Content";
      console.log("FALSE");
    }
  }

  SubmitReview() {
    let observable = this._httpService.createReview(this.newReview);
    observable.subscribe(data => {
      console.log("Review successfully submitted!!!!!!!", data);
      this.newReview = { Content: null, Rating: null, ReviewerId: parseInt(this.id['id']), ProductId: parseInt(this.productId2) };
      location.reload();
    });
  }

  getAllReviews() {
    let observable = this._httpService.getReviews();
    observable.subscribe(data => {
      console.log("Got our reviews!!!!!!!", data);
      this.Reviews = data['Reviews'];
    });
  }

  currentUser() {
    let observable = this._httpService.getUser(this.userid);
    observable.subscribe(data => {
      console.log("Got our user!", data);
      this.user = data['User'];
      var array = this.shoppingcart2
      console.log(JSON.parse(data['User']['ShoppingCart']));
      Object.keys(JSON.parse(data['User']['ShoppingCart'])).forEach(function (key) {
        console.log(key + " $-$ " + JSON.parse(data['User']['ShoppingCart'])[key]);
        array.push(JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key]));
        //console.log(key + " &-& " + JSON.parse(data['User']['ShoppingCart'])[key]);


      });
      this.shoppingcart2 = array;
      this.CartCount = this.shoppingcart2.length;
      console.log("*******Test!!!!!!!********", this.shoppingcart2);
    })
  }

}
