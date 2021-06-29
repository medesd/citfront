import {Component, OnInit} from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import {registerLocaleData} from '@angular/common';
import {NgForm} from '@angular/forms';
import {Absence, Personne} from '../../../models/personne.model';
import {PointageService} from '../pointage.service';
import {Jours} from '../../../models/jours.model';
import * as moment from 'moment';
import {Groupe} from '../../../models/groupe.model';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  groups: Groupe[];
  date = new Date();
  locale = 'fr';
  joursFirier: { entryDate: Date, id: string, summary: string }[];
  mouth = new Date().getMonth();
  dates: Date[] = [];
  personnes: Personne[];

  constructor(private pointageService: PointageService) {
    registerLocaleData(localeFr, this.locale);

  }

  addEmployee(form: NgForm): void {
    const g = this.groups.find(p => p.name === form.value.groupe);
    this.pointageService.addPersonne({...form.value, groupe: g}).subscribe(data => {
      this.personnes.push(data);
    });
  }

  ngOnInit(): void {

    this.getGroupes();
    this.pointageService.getJoursFirier().subscribe(data => {
      this.joursFirier = data;
    });

    this.pointageService.getPersonnes().subscribe(data => {
      this.personnes = data;
      console.log(data);
    });
    const daysInMonth = new Date(this.date.getFullYear(), this.mouth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      this.date.setDate(i);
      const d = this.date;
      this.dates.push(new Date(d.toString()));
    }
  }

  getDateNow(): void {
    this.date = new Date();
    this.dates = [];
    this.mouth = this.date.getMonth();
    const daysInMonth = new Date(this.date.getFullYear(), this.mouth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      this.date.setDate(i);
      const d = this.date;
      this.dates.push(new Date(d.toString()));
    }
  }

  presentInMonth(absents: Absence[]): number {
    if (absents.length > 0) {

      return this.dates.filter(f => f.getDay() !== 0).length -
        absents.filter(p => new Date(p.entryDate).getFullYear() === this.date.getFullYear() &&
          new Date(p.entryDate).getMonth() === this.date.getMonth()).length;
    } else {
      return this.dates.filter(f => f.getDay() !== 0).length;
    }
  }

  absentInMonth(absents: Absence[]): number {
    if (absents.length > 0) {
      return absents.filter(p => new Date(p.entryDate).getFullYear() === this.date.getFullYear() &&
        new Date(p.entryDate).getMonth() === this.date.getMonth()).length;
    } else {
      return 0;
    }
  }

  congesInMonth(absents: Absence[], conges: number): number {
    if (absents.length > 0) {
      return conges - absents.filter(p => new Date(p.entryDate).getFullYear() === this.date.getFullYear()).length;
    } else {
      return conges;
    }
  }

  getJours(jours: Date): string {
    if (this.joursFirier.find(p => new Date(p.entryDate).getDate() === jours.getDate() &&
      new Date(p.entryDate).getMonth() === jours.getMonth() &&
      new Date(p.entryDate).getFullYear() === jours.getFullYear()) !== undefined) {
      return this.joursFirier.find(p => new Date(p.entryDate).getDate() === jours.getDate() &&
        new Date(p.entryDate).getMonth() === jours.getMonth() &&
        new Date(p.entryDate).getFullYear() === jours.getFullYear()).summary;
    } else {
      return null;
    }
  }

  findJours(jours: Date): boolean {
    return this.joursFirier.find(p => new Date(p.entryDate).getDate() === jours.getDate() &&
      new Date(p.entryDate).getMonth() === jours.getMonth() &&
      new Date(p.entryDate).getFullYear() === jours.getFullYear()) !== undefined;
  }


  dateNow(i: Date): boolean {
    const date = new Date();
    return i.toDateString() === date.toDateString();
  }

  changeMonth(type: boolean): void {

    if (type) {
      this.mouth++;
    } else {
      this.mouth--;
    }
    if (this.mouth < 0) {
      this.date.setFullYear(this.date.getFullYear() - 1);
      this.mouth = 11;
    }


    if (this.mouth >= 12) {
      this.date.setFullYear(this.date.getFullYear() + 1);
      this.mouth = 0;
    }


    this.date.setMonth(this.mouth);
    this.dates = [];
    this.date.setMonth(this.mouth);
    const daysInMonth = new Date(this.date.getFullYear(), this.mouth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      this.date.setDate(i);
      const d = this.date;
      this.dates.push(new Date(d.toString()));
    }
  }

  getAbsence(ps: Personne, date: Date): number {
    let f = 0;
    if (ps.absence.findIndex(p => {
      if (this.compareDate(p.entryDate, date)) {
        f = p.type;
        return true;
      }
    }) !== -1) {
      return f;
    } else {
      return 0;
    }
  }

  compareDate(date: Date, second: Date): boolean {
    const first = new Date(date);
    return first.toDateString() === second.toDateString();
  }

  insertConges(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    console.log(form);
    const first = moment(new Date(form.value.from));
    const second = moment(new Date(form.value.to));

    if (first >= second) {
      return;
    }

    const today = first;
    /*today.set({year: first.getFullYear(), month: first.getMonth(), date: first.getDate()});*/

    console.log(today.date(), today.month(), today.year());
    const dates: Date[] = [today.toDate()];
    while (today < second) {
      today.add(1, 'days');
      dates.push(new Date(today.toDate()));
    }

    console.log(dates);
    const personne = this.personnes.find(p => p.name === form.value.employee);
    this.pointageService.addConges((dates), personne.groupe.id, personne.id).subscribe(d => this.ngOnInit());
  }

  makeAction(e, type: number, id: number, i: Date): void {
    let td: HTMLTableCellElement;
    (e.path as HTMLElement[]).forEach(p => {
      if (p.tagName === 'TD') {
        td = p as HTMLTableCellElement;
        return;
      }
    });

    if (type === 1) {
      this.pointageService.addAbsence(id, {entryDate: i, type: 1}).subscribe(data => {
        this.personnes.find(f => f.id === id).absence.push(data);
        td.className = 'bg-danger';
      });
    } else if (type === 2) {
      this.pointageService.addAbsence(id, {entryDate: i, type: 2}).subscribe(data => {
        this.personnes.find(f => f.id === id).absence.push(data);
        td.className = 'bg-warning';
      });
    } else {
      const person = this.personnes.find(p => p.id === id);
      let idd: number = null;

      if (person.absence.find(p => {
        if (this.compareDate(p.entryDate, i)) {
          idd = p.id;
          return true;
        }
      }) !== undefined) {
        this.pointageService.deleteAbsence(person.id, idd).subscribe(data => {
          const index = this.personnes.findIndex(f => f.id === person.id);
          this.personnes[index] = data;
          td.className = '';
        });
      }

    }
  }

  getGroupes(): void {
    this.pointageService.getGroupes().subscribe(d => {
      console.log(d);
      this.groups = d;
    });
  }

  addGroupe(form: NgForm): void {
    if (form.valid) {
      console.log(form);

      this.pointageService.addGroupe(form.value).subscribe(() => this.getGroupes());
    }
  }


  deleteConges(form: NgForm): void {
    console.log(form);
  }

}
