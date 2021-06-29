import { Component, OnInit } from '@angular/core';
import {Pdf} from '../../../models/pdf.model';
import {ModelOneService} from '../model-one/model-one.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Bordereau} from '../../../models/bordereau.model';
import {BordereauService} from '../bordereau/bordereau.service';

@Component({
  selector: 'app-bordereau-history',
  templateUrl: './bordereau-history.component.html',
  styleUrls: ['./bordereau-history.component.css']
})
export class BordereauHistoryComponent implements OnInit {
  bordereaus: Bordereau[];
  error: any;

  constructor(private bordereauService: BordereauService, private route: Router) {
  }

  ngOnInit(): void {
    this.bordereauService.getBordereaus().subscribe(data => {
      this.bordereaus = data;
      this.error = null;
    }, error => {
      this.error = error;
      this.bordereaus = null;
    });
  }

  open(ref: string): void {
    this.route.navigate(['/bordereaushistory', btoa(ref)]).then(null);
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (form.value.search.trim() === '') {
        this.bordereauService.getBordereaus().subscribe(data => {
          this.bordereaus = data;
          this.error = null;
        }, error => {
          this.error = error;
          this.bordereaus = null;
        });
      } else {
        this.bordereauService.getBordereaus(form.value.search).subscribe(data => {
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
