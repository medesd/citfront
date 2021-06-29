import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AccountService} from './account.service';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  error = null;
  lerror = null;

  constructor(private router: Router, private accountService: AccountService, private authService: AuthService) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/projectlist']).then(null);
    } else {
      if (JSON.parse(localStorage.getItem('user')).roles.indexOf('ROLE_ADMIN') === -1) {
        this.router.navigate(['/projectlist']).then(null);
      }
    }
  }

  checkLogin() {
    return localStorage.getItem('user');
  }

  getUsername() {
    return JSON.parse(localStorage.getItem('user')).username;
  }


  onSubmit(frm: NgForm) {
    if (frm.valid) {
      if (frm.value.new_password === frm.value.con_new_password) {
        this.accountService.change_password({
          cur_password: frm.value.cur_password,
          new_password: frm.value.new_password
        }, JSON.parse(localStorage.getItem('user')).id).subscribe(data => {
          if (data) {
            this.lerror = null;
          }

          frm.reset();
        }, () => {
          this.lerror = 'le mot de passe incorrect';
        });
      } else {
        this.lerror = 'conferme votre mot de passe';
      }

    }

  }

  onChange(frm: NgForm) {
    if (frm.valid) {
      this.accountService.change_username({
        username: frm.value.username,
        password: frm.value.password
      }, JSON.parse(localStorage.getItem('user')).id).subscribe(data => {
        if (data != null) {
          this.authService.login(frm.value).subscribe(t => {
            localStorage.setItem('user', JSON.stringify(t));
            window.location.reload();
          });
          frm.reset();
        } else {
          this.error = 'le Nom d\'utilusateur deja exist';
        }

      }, () => {
        this.error = 'le mot de passe incorrect';
      });
    }

  }
}
