import {Injectable} from '@angular/core';
import {Project} from '../../models/project.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {
  }

  getUser(): any {
    return {
      headers: new HttpHeaders({
        Authorization: `${JSON.parse(localStorage.getItem('user')).tokenType + ' ' + JSON.parse(localStorage.getItem('user')).accessToken}`
      })
    };
  }

  async getProjects(): Promise<any> {
    return await this.http.get<Project[]>(environment.site + '/projects/', this.getUser()).toPromise();
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete<Project>(environment.site + '/projects/' + id, this.getUser());
  }

  sendProject(value: string): Observable<any> {
    return this.http.get<Project[]>(environment.site + '/projects/filter?id=' + value, this.getUser());
  }

  addProject(project: Project): Observable<any> {
    return this.http.post<Project>(environment.site + '/projects/', project, this.getUser());
  }

  updateProject(id: string, project: Project): Observable<any> {
    return this.http.put<Project>(environment.site + '/projects/' + id, project, this.getUser());
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get<Project>(environment.site + '/projects/' + id, this.getUser());
  }
}
