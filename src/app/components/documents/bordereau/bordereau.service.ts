import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Bordereau} from '../../../models/bordereau.model';

@Injectable({
  providedIn: 'root'
})
export class BordereauService {

  getUser(): any {
    return {
      headers: new HttpHeaders({
        Authorization: `${JSON.parse(localStorage.getItem('user')).tokenType + ' ' + JSON.parse(localStorage.getItem('user')).accessToken}`
      })
    };
  }

  constructor(private http: HttpClient) {
  }

  sendBordereau(f: FormData): Observable<any> {
    return this.http.post(environment.site + '/bordereaus', f, this.getUser());
  }

  getBordereaus(filter = ''): Observable<any> {
    if (filter === '') {
      return this.http.get<Bordereau[]>(environment.site + '/bordereaus', this.getUser());
    } else {
      return this.http.get<Bordereau[]>(environment.site + '/bordereaus?filter=' + filter, this.getUser());
    }
  }

  getBordereau(ref: string): Observable<any> {
    return this.http.get<Bordereau>(environment.site + '/bordereaus/' + ref, this.getUser());
  }

  deleteBordereau(ref: string): Observable<any> {
    return this.http.delete<{ text: string }>(environment.site + '/bordereaus/' + ref, this.getUser());
  }
}
