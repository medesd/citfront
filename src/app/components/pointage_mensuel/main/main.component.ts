import {Component, OnInit} from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import {registerLocaleData} from '@angular/common';
import {NgForm} from '@angular/forms';
import {Absence, Personne} from '../../../models/personne.model';
import {PointageService} from '../pointage.service';
import * as moment from 'moment';
import {Groupe} from '../../../models/groupe.model';
import {ToastrService} from 'ngx-toastr';


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
  gestion: { name: string, absence: number, present: number, conges: number, id: number }[];

  constructor(private pointageService: PointageService, private toastrService: ToastrService) {
    registerLocaleData(localeFr, this.locale);

  }


  gestionRes(): void {
    this.gestion = [];
    this.personnes.forEach(pss => {
      const present = this.presentInMonth(pss.absence);
      const name = pss.name;
      const absence = this.absentInMonth(pss.absence);
      const conges = this.congesInMonth(pss.absence, pss.conges);
      const gs: { name: string, absence: number, present: number, conges: number, id: number } = {
        name,
        absence,
        conges,
        present,
        id: pss.id,
      };

      this.gestion.push(gs);
    });
  }

  addEmployee(form: NgForm): void {
    if (this.groups.findIndex(p => p.name.trim() === form.value.name.trim()) !== -1) {
      this.toastrService.error('Employee deja exist');
      return;
    }
    const g = this.groups.find(p => p.name === form.value.groupe);
    this.pointageService.addPersonne({...form.value, groupe: g}).subscribe(data => {
      this.personnes.push(data);
      this.toastrService.success('ajouter avec succes');
      this.gestionRes();
    });
  }

  ngOnInit(): void {

    this.dates = [];
    this.groups = [];
    this.personnes = [];
    this.joursFirier = [];
    this.getGroupes();
    this.pointageService.getJoursFirier().subscribe(data => {
      this.joursFirier = data;
    });

    this.pointageService.getPersonnes().subscribe(data => {
      this.personnes = data;
      this.gestionRes();
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
    console.error();
    return this.dates.filter(f => f.getDay() !== 0)
      .filter(f => this.joursFirier.findIndex(d => this.compareDate(f, d.entryDate)) === -1)
      .length - absents.filter(p => new Date(p.entryDate).getFullYear() === this.date.getFullYear() &&
      new Date(p.entryDate).getMonth() === this.date.getMonth())
      .filter(p => new Date(p.entryDate).getDay() !== 0)
      .filter(p => new Date(p.entryDate).getDay() !== 6)
      .filter(p => this.joursFirier.findIndex(d => this.compareDate(d.entryDate, p.entryDate)) === -1)
      .length;

  }

  absentInMonth(absents: Absence[]): number {
    return absents.filter(p => new Date(p.entryDate).getFullYear() === this.date.getFullYear() &&
      new Date(p.entryDate).getMonth() === this.date.getMonth() && p.type !== 3 && p.type !== 4).length;
  }

  congesInMonth(absents: Absence[], conges: number): number {
    return conges - absents
      .filter(p => new Date(p.entryDate).getDay() !== 6)
      .filter(p => new Date(p.entryDate).getDay() !== 0)
      .filter(p => this.joursFirier.findIndex(d => this.compareDate(p.entryDate, d.entryDate)) === -1)
      .filter(p => new Date(p.entryDate).getFullYear() === this.date.getFullYear())
      .length;
  }

  getJours(jours: Date): string {
    if (this.joursFirier.find(p => this.compareDate(jours, p.entryDate)) !== undefined) {
      return this.joursFirier.find(p => this.compareDate(jours, p.entryDate)).summary;
    } else {
      return null;
    }
  }

  findJours(jours: Date): boolean {
    return this.joursFirier.find(p => this.compareDate(p.entryDate, jours)) !== undefined;
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

  compareDate(date: Date, last: Date): boolean {
    const first = new Date(date);
    const second = new Date(last);
    return first.toDateString() === second.toDateString();
  }

  insertConges(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    const today = moment(new Date(form.value.from));
    let second = +form.value.to;
    const dates: Date[] = [today.toDate()];
    if (dates[0].getDay() === 0 ||
      dates[0].getDay() === 6 ||
      this.joursFirier.findIndex(p => this.compareDate(p.entryDate, dates[0])) !== -1) {
      second++;
      console.error(dates[0]);
    }
    for (let i = 0; i < second - 1; i++) {
      today.add(1, 'days');
      dates.push(new Date(today.toDate()));
      if (today.toDate().getDay() === 6 ||
        today.toDate().getDay() === 0 ||
        this.joursFirier.findIndex(p => this.compareDate(p.entryDate, today.toDate())) !== -1) {
        second++;
      }
    }

    console.log(dates);


    const personne = this.personnes.find(p => p.name === form.value.employee);


    this.pointageService.addConges(dates, personne.groupe.id, personne.id).subscribe(d => {
      if (d === null) {
        this.toastrService.error('probleme dans l\'ajoute');
      } else {
        if (d === 1) {
          this.toastrService.success('ajouter effectuer avec succes');
        }
        if (d === 2) {
          this.toastrService.warning('Il y a une superposition');
        }
      }
      this.ngOnInit();
    });
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
        this.gestionRes();
        td.className = 'bg-danger';
      });
    } else if (type === 2) {
      this.pointageService.addAbsence(id, {entryDate: i, type: 2}).subscribe(data => {
        this.personnes.find(f => f.id === id).absence.push(data);
        this.gestionRes();
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
          this.gestionRes();
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
      this.pointageService.getGroupes().subscribe(d => this.groups = d);
      if (this.groups.findIndex(f => f.name.trim() === form.value.name.trim()) !== -1) {
        this.toastrService.error('le groupe deja exist');
        return;
      }
      this.pointageService.addGroupe(form.value).subscribe(() => {
        this.getGroupes();
        this.toastrService.success('ajouter avec succes');
      });
    }
  }


  deleteConges(form: NgForm): void {
    const name = form.value.employee;

    const first = moment(new Date(form.value.from));
    const second = moment(new Date(form.value.to));

    if (first >= second) {
      return;
    }

    const today = first;

    console.log(today.date(), today.month(), today.year());
    const dates: Date[] = [today.toDate()];
    while (today < second) {
      today.add(1, 'days');
      dates.push(new Date(today.toDate()));
    }

    console.log(dates.filter(f => f.getDay() === 0));
    const personne = this.personnes.find(p => p.name === form.value.employee);
    this.pointageService.deleteConges(personne.id, dates).subscribe(d => {
      if (d === null) {
        this.toastrService.error('erreur dans la supprision');
      } else {
        this.toastrService.success('supprimé');
      }
      this.ngOnInit();
    });
  }

  deleteEmployee(id: number): void {
    this.pointageService.deletePersonne(id).subscribe(d => {
      this.personnes = this.personnes.filter(p => p.id !== id);
      this.gestionRes();
    });
  }

}
