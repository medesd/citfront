import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginTempsService {

  constructor(private http: HttpClient) {
  }

  getUser() {
    return {
      headers: new HttpHeaders({
        'Authorization': `${JSON.parse(localStorage.getItem('user')).tokenType + ' ' + JSON.parse(localStorage.getItem('user')).accessToken}`
      })
    };
  }

  getLoginTemps() {
    return this.http.get<LoginTemps[]>(environment.site + '/loginTemps', this.getUser());
  }
}

export class LoginTemps {
  constructor(public userName: string, public entryDate: Date, public id?: number) {
  }
}
