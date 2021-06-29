import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Bordereau} from '../../../models/bordereau.model';

@Injectable({
  providedIn: 'root'
})
export class FacturesService {

  getUser(): any {
    return {
      headers: new HttpHeaders({
        Authorization: `${JSON.parse(localStorage.getItem('user')).tokenType + ' ' + JSON.parse(localStorage.getItem('user')).accessToken}`
      })
    };
  }

  constructor(private http: HttpClient) {
  }

  sendFacture(f: FormData): Observable<any> {
    return this.http.post(environment.site + '/factures', f, this.getUser());
  }

  getFactures(filter = ''): Observable<any> {
    if (filter === '') {
      return this.http.get<Bordereau[]>(environment.site + '/factures', this.getUser());
    } else {
      return this.http.get<Bordereau[]>(environment.site + '/factures?filter=' + filter, this.getUser());
    }
  }

  getFacture(ref: string): Observable<any> {
    return this.http.get<Bordereau>(environment.site + '/factures/' + ref, this.getUser());
  }

  deleteFacture(ref: string): Observable<any> {
    return this.http.delete<{ text: string }>(environment.site + '/factures/' + ref, this.getUser());
  }
}
