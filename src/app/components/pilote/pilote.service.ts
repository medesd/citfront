import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Pilote} from '../../models/pilote.model';
import {Project} from '../../models/project.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PiloteService {
  public pilotesNames: { id: string, last_name: string }[];

  constructor(private http: HttpClient) {
  }

  getUser() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${JSON.parse(localStorage.getItem('user')).tokenType + ' ' + JSON.parse(localStorage.getItem('user')).accessToken}`
      })
    };
  }

  getAllPilotes() {
    return this.http.get<Pilote[]>(environment.site + '/pilotes/', this.getUser());
  }

  getPiloteProjects(id: string) {
    return this.http.get<Project[]>(environment.site + '/pilotes/projects/' + id, this.getUser());
  }

  async getPilotesNames() {
    this.pilotesNames = await this.http.get<{ id: string, last_name: string }[]>(environment.site + '/pilotes/names', this.getUser()).toPromise();
  }

  getPilote(id: string) {
    return this.http.get<Pilote>(environment.site + '/pilotes/' + id, this.getUser());
  }


  removePilote(id: string) {
    return this.http.delete<Pilote>(environment.site + '/pilotes/' + id, this.getUser());
  }

  addPilote(pilote: Pilote) {
    return this.http.post<Pilote>(environment.site + '/pilotes/', pilote, this.getUser());
  }

  editPilote(id: string, p: Pilote) {
    return this.http.put<Pilote>(environment.site + '/pilotes/' + id, p, this.getUser());
  }
}
