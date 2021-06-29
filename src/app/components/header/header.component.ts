import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription, timer} from 'rxjs';
import {AccountService} from '../account/account.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ModelOneComponent} from '../documents/model-one/model-one.component';
import {BordereauComponent} from '../documents/bordereau/bordereau.component';
import {FacturesComponent} from '../documents/factures/factures.component';
import {PointageService} from "../pointage_mensuel/pointage.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  subscribe: Subscription;
  url: string;


  constructor(public route: Router, public authService: AuthService, private accountService: AccountService, private rt: ActivatedRoute, private pointageService: PointageService) {

  }

  reloadFacture(): void {
    this.rt.children?.find(p => {
      if (p.component === FacturesComponent) {
        window.location.reload();
      }
    });
  }

  reload(): void {
    this.rt.children?.find(p => {
      if (p.component === ModelOneComponent) {
        window.location.reload();
      }
    });
  }

  makingSome(): void {
    this.rt.children?.find(p => {
      if (p.component === BordereauComponent) {
        window.location.reload();
      }
    });
  }

  ngOnInit(): void {
    this.pointageService.addJoursFirier();
    const source = timer(1000, 2000);
    this.subscribe = source.subscribe(() => {
      if (localStorage.getItem('user')) {
        if (JSON.parse(localStorage.getItem('user')).accessToken) {
          this.accountService.checkUser(JSON.parse(localStorage.getItem('user')).accessToken).subscribe(t => {
            if (!t) {
              this.deconnecter();
              this.subscribe.unsubscribe();
              window.location.reload();
            }
          });
        }
      } else {
        this.deconnecter();
        window.location.reload();
      }
    });
  }

  deconnecter(): void {
    localStorage.removeItem('user');
    this.authService.check = false;
  }


  checkadmin(): boolean {
    return JSON.parse(localStorage.getItem('user')).roles.indexOf('ROLE_ADMIN') !== -1;
  }


}
