import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {Pdf} from '../../../models/pdf.model';

@Injectable({
  providedIn: 'root'
})
export class ModelOneService {

  getUser(): any {
    return {
      headers: new HttpHeaders({
        Authorization: `${JSON.parse(localStorage.getItem('user')).tokenType + ' ' + JSON.parse(localStorage.getItem('user')).accessToken}`
      })
    };
  }

  constructor(private http: HttpClient) {
  }

  sendPdf(f: FormData): Observable<any> {
    return this.http.post(environment.site + '/models', f, this.getUser());
  }

  getPdfs(filter = ''): Observable<any> {
    if (filter === '') {
      return this.http.get<Pdf[]>(environment.site + '/models', this.getUser());
    } else {
      return this.http.get<Pdf[]>(environment.site + '/models?filter=' + filter, this.getUser());
    }
  }

  getPdf(ref: string): Observable<any> {
    return this.http.get<Pdf>(environment.site + '/models/' + ref, this.getUser());
  }

  deletePdf(ref: string): Observable<any> {
    return this.http.delete<{ text: string }>(environment.site + '/models/' + ref, this.getUser());
  }
}
