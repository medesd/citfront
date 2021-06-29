import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Pilote} from '../../../models/pilote.model';
import {PiloteService} from '../pilote.service';
import {NgForm} from '@angular/forms';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-edit-pilote',
  templateUrl: './edit-pilote.component.html',
  styleUrls: ['./edit-pilote.component.css']
})
export class EditPiloteComponent implements OnInit {
  @Input() pilote: Pilote;
  @Output('evt') outpilote = new Subject<Pilote>();
  daten: string;
  exp: string;
  entry: string;
  @ViewChild('close') closemodal;
  loding = false;


  constructor(private piloteService: PiloteService) {
  }

  ngOnInit(): void {
    let dte = new Date();
    dte.setDate(new Date(this.pilote.date_naissance).getDate());
    this.daten = this.formatDate(this.pilote.date_naissance);
    this.exp = this.formatDate(this.pilote.experence);
    this.entry = this.formatDate(this.pilote.entry_date);
  }

  onEdit(frm: NgForm) {

    if (frm.valid) {
      this.loding = true;
      this.piloteService.editPilote(this.pilote.id, frm.value).subscribe(data => {
        this.outpilote.next(data);
        this.loding = false;
        this.closemodal.nativeElement.click();
      });
    }
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    if (year === 1970) {
      return null;
    } else {
      return [year, month, day].join('-');
    }
  }

}
