import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {AccountService} from '../../account/account.service';
import {Users, ids} from '../../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  users: User[];
  erreur = false;
  error = null;
  lerror = null;
  showrole1: boolean[] = [];
  showusername1: boolean[] = [];
  showpassword1: boolean[] = [];

  constructor(private authService: AuthService, private router: Router, private accountService: AccountService) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/projectlist']).then(null);
    } else {
      if (JSON.parse(localStorage.getItem('user')).roles.indexOf('ROLE_ADMIN') === -1) {
        this.router.navigate(['/projectlist']).then(null);
      } else {
        this.accountService.getUsers().subscribe(data => {
          this.users = data;
          this.users.forEach(() => {
            this.showrole1.push(false);
            this.showusername1.push(false);
            this.showpassword1.push(false);
          });
          this.users = this.users.filter(d => {
            return d.id !== JSON.parse(localStorage.getItem('user')).id;
          });
        });
      }
    }

  }

  deleteUser(num: number) {
    this.accountService.deleteUser(this.users[num].id).subscribe(data => {
      this.users = this.users.filter(d => {
        return d.id != data.id;
      });
    });
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {
      let role: { id: number, name: string } = {id: +frm.value.roles, name: null};
      if (role.id === 1) {
        role.name = 'ROLE_USER';
      }

      if (role.id === 2) {
        role.name = 'ROLE_ADMIN';
      }
      let user = new Users(frm.value.sur_username, frm.value.sur_password, [role]);
      console.log(user);
      this.accountService.addUser(user).subscribe(data => {
        if (data == null) {
          this.erreur = true;
        } else {
          this.erreur = false;
          let user = new User(data.id, data.username);
          this.users.push(user);
        }
      }, () => {
        this.erreur = true;
      });
    }
  }

  onpassword(frm: NgForm, id: string, i: number) {
    if (frm.valid) {
      if (frm.value.lnew_password === frm.value.lcon_new_password) {
        this.accountService.setPassword({id: id, some: frm.value.lnew_password}).subscribe(data => {
          if (data) {
            this.showpassword1[i] = !this.showpassword1[i];
            this.lerror = null;
          } else {

            this.lerror = 'erreur';
          }
          frm.reset();
        }, () => {
          this.lerror = 'erreur';
        });
      } else {
        this.lerror = 'conferme votre mot de passe';
      }

    }
  }

  onChange(frm: NgForm, id: string, i: number) {
    if (frm.valid) {
      this.accountService.setUsername({id: id, some: frm.value.username}).subscribe(data => {
        if (data != null) {
          frm.reset();
          this.users[i].username = data.username;
          this.showusername1[i] = !this.showusername1[i];
        } else {
          this.error = 'le Username deja exist';
        }
      }, () => {
        this.error = 'erreur';
      });
    }
  }

  setRole(frm: NgForm, num: number) {
    if (frm.valid) {
      this.accountService.setRole({id: this.users[num].id, role: +frm.value.role}).subscribe(data => {
        this.showrole1[num] = false;
        return data;
      });
    }

  }


  showrole(i: number) {
    this.showrole1[i] = !this.showrole1[i];
    this.showusername1[i] = false;
    this.showpassword1[i] = false;
  }

  showusername(i: number) {
    this.showusername1[i] = !this.showusername1[i];
    this.showrole1[i] = false;
    this.showpassword1[i] = false;
  }

  showpassword(i: number) {
    this.showpassword1[i] = !this.showpassword1[i];
    this.showusername1[i] = false;
    this.showrole1[i] = false;
  }

}

export class User {
  constructor(public id: string, public username: string) {
  }


}
