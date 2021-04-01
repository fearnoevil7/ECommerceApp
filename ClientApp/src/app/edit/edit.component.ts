import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  id: {};
  @Input() user: any;
  UserToUpdate: {};
  first_Name: string;
  last_Name: string;
  _email: string;
  userid: number;
  user1: any;
  shoppingcart2 = [];
  CartCount: number;

  CurrentPageUserIsOn = "EditProfile";

  constructor(
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
    this.showUser();
    this.UserToUpdate = { firstName: "", lastName: "", email: "", password: "" };
    this.isUserAuthenticated();
    this.currentUser();
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

  logOut() {
    window.localStorage.clear();
    this._route.navigate([""]);
  }

  showUser() {
    console.log("*******showUser id test", this.id);
    let observable = this._httpService.getUser(this.id['id']);
    observable.subscribe(data => {
      this.user = data['User'];
      console.log("Got the selected user", this.user);
      console.log("Got the selected user's email", this.user['Email']);
      this.first_Name = this.user['FirstName'];
      this.last_Name = this.user['LastName'];
      this._email = this.user['Email'];
    })
  }

  sendToUpdate() {
    console.log("Edit component!", this.UserToUpdate);
    let observable = this._httpService.updateUser(this.id['id'], this.UserToUpdate);
    observable.subscribe(data => {
      console.log(data);
      this._route.navigate(["edit"]);
    })
  }

  currentUser() {
    let observable = this._httpService.getUser(this.userid);
    observable.subscribe(data => {
      console.log("Got our user!", data);
      this.user1 = data['User'];
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
