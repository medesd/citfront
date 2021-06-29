import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Absence, Personne} from '../../models/personne.model';
import {Groupe} from '../../models/groupe.model';
import {Observable} from 'rxjs';
import {Jours} from '../../models/jours.model';

@Injectable({
  providedIn: 'root'
})
export class PointageService {

  constructor(private http: HttpClient) {
  }

  getGroupes(): Observable<Groupe[]> {
    return this.http.get<Groupe[]>('http://localhost:8080/groupe');
  }

  addGroupe(groupe: Groupe): Observable<number> {
    return this.http.post<number>('http://localhost:8080/groupe', groupe);
  }

  getPersonnes(): Observable<Personne[]> {
    return this.http.get<Personne[]>('http://localhost:8080/personne');
  }

  addPersonne(p: Personne): Observable<Personne> {
    return this.http.post<Personne>('http://localhost:8080/personne', p);
  }

  addAbsence(id: number, absence: Absence): Observable<Absence> {
    return this.http.put<Absence>('http://localhost:8080/personne/add/' + id, absence);
  }

  deleteAbsence(id: number, absence: number): Observable<Personne> {
    return this.http.put<Personne>(`http://localhost:8080/personne/delete?absenceId=${absence}&personneId=${id}`, null);
  }

  addJoursFirier(): void {
    this.http.get<Jours>('https://www.googleapis.com/calendar/v3/calendars/fr.ma%23holiday%40group.v.calendar.google.com/events?key=AIzaSyCqu9czzS5JbHfkbe1id_OG3tOwTqBkxfg').subscribe(data => {
      if (data) {
        const jours: { entryDate: Date, id: string, summary: string }[] = [];
        data.items.filter(r => r.summary.indexOf('Heure') === -1).forEach(p => {
          jours.push({entryDate: new Date(p.start.date), id: p.id, summary: p.summary});
        });
        this.http.post<number>('http://localhost:8080/personne/jours', jours).subscribe(p => console.log(p));
      }
    });
  }

  getJoursFirier(): Observable<{ entryDate: Date, id: string, summary: string }[]> {
    return this.http.get<{ entryDate: Date, id: string, summary: string }[]>('http://localhost:8080/personne/jours');
  }

  addConges(dates: Date[], groupeId: number, personneId: number): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/personne/conges?groupeId=${groupeId}&personneId=${personneId}`, dates);
  }
}
