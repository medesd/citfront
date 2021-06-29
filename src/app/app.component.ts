import {Component, OnDestroy, OnInit} from '@angular/core';
import {PiloteService} from './components/pilote/pilote.service';
import {AuthService} from './components/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {


  constructor(public piloteService: PiloteService, public authService: AuthService) {

  }


  checkUser(): boolean {
    return localStorage.getItem('user') !== null;
  }

  ngOnDestroy(): void {

  }
}
