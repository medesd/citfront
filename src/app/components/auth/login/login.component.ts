import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {PiloteService} from '../../pilote/pilote.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: boolean = false;
  loding = false;

  constructor(private authService: AuthService, private router: Router, private piloteService: PiloteService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']).then(null);
    }

  }

  login(frm: NgForm): void {
    if (frm.valid) {
      this.loding = true;
      this.authService.login(frm.value).subscribe(data => {
        localStorage.setItem('user', JSON.stringify(data));
        this.error = false;
        if (data.roles.toString().indexOf('ROLE_ADMIN') !== -1) {
          this.router.navigate(['/']).then(null);
          this.piloteService.getPilotesNames().then(null);
        } else {
          this.router.navigate(['/projectlist']).then(null);
          this.piloteService.getPilotesNames().then(null);
        }
        window.location.reload();
        this.authService.check = true;
      }, error => {
        if (error.status === 401) {
          this.error = true;
          this.authService.check = false;
          this.loding = false;
        }
      });
    }
  }

}
