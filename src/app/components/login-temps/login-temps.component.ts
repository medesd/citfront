import {Component, OnInit} from '@angular/core';
import {LoginTempsService, LoginTemps} from './login-temps.service';

@Component({
  selector: 'app-login-temps',
  templateUrl: './login-temps.component.html',
  styleUrls: ['./login-temps.component.css']
})
export class LoginTempsComponent implements OnInit {
  loginTemps: LoginTemps[];

  constructor(private loginTempsService: LoginTempsService) {
  }

  ngOnInit(): void {
    this.loginTempsService.getLoginTemps().subscribe(data => {
      this.loginTemps = data;
    });
  }

}
