import {Component, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PiloteService} from '../pilote.service';
import {Subject} from 'rxjs';
import {Pilote} from '../../../models/pilote.model';

@Component({
  selector: 'app-ajouter-pilote',
  templateUrl: './ajouter-pilote.component.html',
  styleUrls: ['./ajouter-pilote.component.css']
})
export class AjouterPiloteComponent implements OnInit {
  @Output() plt = new Subject<Pilote>();
  loding = false;

  constructor(private piloteService: PiloteService) {
  }

  ngOnInit(): void {
  }

  onSubmit(frm: NgForm) {
    if (frm.valid) {

      this.loding = true;
      this.piloteService.addPilote(frm.value).subscribe(data => {
        this.plt.next(data);
        this.loding = false;
      });
    }
  }

}
