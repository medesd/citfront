import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../auth/register/register.component';
import {Users} from '../../models/user.model';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {
  }

  checkUser(user: string): Observable<boolean> {
    return this.http.post<boolean>(environment.site + '/user/check', user);
  }


  change_password(pss: { cur_password: string, new_password: string }, id: string) {
    return this.http.post<{ cur_password: string, new_password: string }>(environment.site + '/user/password/' + id, pss, this.getUser());
  }

  change_username(user: { username: string, password: string }, id: string) {
    return this.http.post<{ username: string, password: string }>(environment.site + '/user/username/' + id, user, this.getUser());
  }

  getUser() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${JSON.parse(localStorage.getItem('user')).tokenType + ' ' + JSON.parse(localStorage.getItem('user')).accessToken}`
      })
    };
  }

  getUsers() {
    return this.http.get<User[]>(environment.site + '/user/', this.getUser());
  }

  deleteUser(id: string) {
    return this.http.delete<User>(environment.site + '/user/' + id, this.getUser());
  }

  addUser(user: Users) {
    return this.http.post<Users>(environment.site + '/user/', user, this.getUser());
  }


  setRole(role: { id: string, role: number }) {
    return this.http.post<Users>(environment.site + '/user/role', role, this.getUser());
  }


  setUsername(some: { id: string, some: string }) {
    return this.http.post<Users>(environment.site + '/user/username', some, this.getUser());
  }

  setPassword(some: { id: string, some: string }) {
    return this.http.post<Users>(environment.site + '/user/password', some, this.getUser());
  }
}
