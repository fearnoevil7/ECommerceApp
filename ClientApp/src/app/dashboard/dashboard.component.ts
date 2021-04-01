import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: any;
  id: {};
  userid: number;
  unpackedId: number;
  products = [];
  mostExpensiveItem = 0;
  lowestPricedItem = 0;
  CurrentPageUserIsOn = "Dashboard";
  shoppingcart2 = [];
  CartCount: number;
  user: any;

  constructor(
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
    this.getUsersFromService();
    this.getProductsFromService();
  }

  isUserAuthenticated() { //method of authenticating with webtoken directly in component.ts file
    let token: string = localStorage.getItem("token");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.id = { id: this.jwtHelper.decodeToken(token).nameid }
      console.log("*******!!!!!!!!********!!!!!!!!", this.jwtHelper.decodeToken(token).nameid);
      console.log("*******!!!!!!!!********!!!!!!!!", this.jwtHelper.decodeToken(token));
      console.log("*******!!!!!!!!********!!!!!!!!", this.id);
      this.unpackedId = this.id['id'];
      this.userid = parseInt(this.jwtHelper.decodeToken(token).nameid, 10);
      console.log("*******!!!!!!!!********!!!!!!!!", this.unpackedId);

      return true;
    } else {
        this.logOut();
        return false;
    }
  }

  logOut() {
    window.localStorage.clear();
    this._route.navigate([""]);
  }

  getUsersFromService() {
    let observable = this._httpService.getUsers();
    observable.subscribe(data => {
      console.log("Got our users!", data);
      this.users = data['Users'];
      console.log(this.users);
    })
  }
  Destroy(id) {
    let observable = this._httpService.deleteUser(id);
    observable.subscribe(data => {
      console.log("User successfully deleted!", data);
      this._route.navigate(["customers"]);
    })
  }
  getProductsFromService() {
    let observable = this._httpService.getProducts();
    observable.subscribe(data => {
      this.products = data['Products'];

      //this.totalRecords = data['Products'].length;


      console.log("Got our products from service!", this.products);
      for (var x = 0; x < data['Products'].length; x++) {
        console.log("test");
        if (data['Products'][x]['Price'] > this.mostExpensiveItem) {
          this.mostExpensiveItem = data['Products'][x]['Price'];
        }
        if (data['Products'][x]['Price'] < this.lowestPricedItem) {
          this.lowestPricedItem = data['Products'][x]['Price'];
        }
      }
      console.log("^^^^^^^^^^^^^^", this.lowestPricedItem);
      console.log("^^^^^^^^^^^^^^", this.mostExpensiveItem);
      window.localStorage.setItem("minPrice", this.lowestPricedItem.toString());
      window.localStorage.setItem("maxPrice", this.mostExpensiveItem.toString());
      console.log("^^^^^^^^^^^^^^", parseFloat(window.localStorage.getItem("minPrice")));
      console.log("^^^^^^^^^^^^^^", parseFloat(window.localStorage.getItem("maxPrice")));
    })
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
