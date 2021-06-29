import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Signin} from '../../models/signin.model';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signin: Signin;
  check: boolean;
  hide = false;

  constructor(private http: HttpClient) {
    this.check = !!localStorage.getItem('user');
  }

  login(login: { username: string, password: string }): Observable<Signin> {
    return this.http.post<Signin>(environment.site + '/auth/signin', login);
  }

  hideheader(): void {
    this.hide = !this.hide;
  }
}
