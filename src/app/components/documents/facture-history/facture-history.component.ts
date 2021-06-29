import { Component, OnInit } from '@angular/core';
import {Bordereau} from '../../../models/bordereau.model';
import {BordereauService} from '../bordereau/bordereau.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {FacturesService} from '../factures/factures.service';

@Component({
  selector: 'app-facture-history',
  templateUrl: './facture-history.component.html',
  styleUrls: ['./facture-history.component.css']
})
export class FactureHistoryComponent implements OnInit {

  bordereaus: Bordereau[];
  error: any;

  constructor(private facturesService: FacturesService, private route: Router) {
  }

  ngOnInit(): void {
    this.facturesService.getFactures().subscribe(data => {
      this.bordereaus = data;
      this.error = null;
    }, error => {
      this.error = error;
      this.bordereaus = null;
    });
  }

  open(ref: string): void {
    this.route.navigate(['/factureshistory', btoa(ref)]).then(null);
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (form.value.search.trim() === '') {
        this.facturesService.getFactures().subscribe(data => {
          this.bordereaus = data;
          this.error = null;
        }, error => {
          this.error = error;
          this.bordereaus = null;
        });
      } else {
        this.facturesService.getFactures(form.value.search).subscribe(data => {
          this.bordereaus = data;
          this.error = null;
        }, error => {
          this.error = error;
          this.bordereaus = null;
        });
      }
    }
  }

}
