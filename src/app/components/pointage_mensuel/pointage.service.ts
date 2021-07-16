import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Absence, Personne} from '../../models/personne.model';
import {Groupe} from '../../models/groupe.model';
import {Observable} from 'rxjs';
import {Jours} from '../../models/jours.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PointageService {

  constructor(private http: HttpClient) {
  }

  getGroupes(): Observable<Groupe[]> {
    return this.http.get<Groupe[]>(environment.site + '/groupe');
  }

  addGroupe(groupe: Groupe): Observable<number> {
    return this.http.post<number>(environment.site + '/groupe', groupe);
  }

  getPersonnes(): Observable<Personne[]> {
    return this.http.get<Personne[]>(environment.site + '/personne');
  }

  addPersonne(p: Personne): Observable<Personne> {
    return this.http.post<Personne>(environment.site + '/personne', p);
  }

  addAbsence(id: number, absence: Absence): Observable<Absence> {
    return this.http.put<Absence>(environment.site + '/personne/add/' + id, absence);
  }

  deleteAbsence(id: number, absence: number): Observable<Personne> {
    return this.http.put<Personne>(`${environment.site}/personne/delete?absenceId=${absence}&personneId=${id}`, null);
  }

  addDays(date, days): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  addJoursFirier(): void {
    this.http.get<Jours>('https://www.googleapis.com/calendar/v3/calendars/fr.ma%23holiday%40group.v.calendar.google.com/events?key=AIzaSyCqu9czzS5JbHfkbe1id_OG3tOwTqBkxfg').subscribe(data => {
      if (data) {
        const jours: { entryDate: Date, id: string, summary: string }[] = [];
        data.items.filter(r => r.summary.indexOf('Heure') === -1).forEach(p => {
          jours.push({entryDate: new Date(p.start.date), id: p.id, summary: p.summary});
          if (p.summary.indexOf('Al-Adha') !== -1) {
            const jour: { entryDate: Date, id: string, summary: string } = {
              entryDate: this.addDays(p.start.date, 1),
              id: p.id + 'k',
              summary: 'Aïd Al-Adha'
            };
            jours.push(jour);
          }
        });
        this.http.post<number>(environment.site + '/personne/jours', jours).subscribe(() => null);
      }
    });
  }

  getJoursFirier(): Observable<{ entryDate: Date, id: string, summary: string }[]> {
    return this.http.get<{ entryDate: Date, id: string, summary: string }[]>(environment.site + '/personne/jours');
  }

  addConges(dates: Date[], groupeId: number, personneId: number): Observable<any> {
    return this.http.post<any>(`${environment.site}/personne/conges?groupeId=${groupeId}&personneId=${personneId}`, dates);
  }

  deleteConges(personneId: number, dates: Date[]): Observable<number> {
    return this.http.patch<number>(environment.site + '/personne/conges/' + personneId, dates);
  }

  deletePersonne(id: number): Observable<number> {
    return this.http.delete<number>(environment.site + '/personne/' + id);
  }

  getPersonnesInGroupe(id: number): Observable<Personne[]> {
    return this.http.get<Personne[]>(environment.site + '/groupe/' + id);
  }

  deleteGroupe(id: number): Observable<number> {
    return this.http.delete<number>(environment.site + '/groupe/' + id);
  }
}
