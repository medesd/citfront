import {Component, OnInit} from '@angular/core';
import {ModelOneService} from '../model-one/model-one.service';
import {Pdf} from '../../../models/pdf.model';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-model-history',
  templateUrl: './model-history.component.html',
  styleUrls: ['./model-history.component.css']
})
export class ModelHistoryComponent implements OnInit {
  pdfs: Pdf[];
  error: any;

  constructor(private modelOneService: ModelOneService, private route: Router) {
  }

  ngOnInit(): void {
    this.modelOneService.getPdfs().subscribe(data => {
      this.pdfs = data;
      this.error = null;
    }, error => {
      this.error = error;
      this.pdfs = null;
    });
  }

  open(ref: string): void {
    this.route.navigate(['/modelshistory', btoa(ref)]).then(null);
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (form.value.search.trim() === '') {
        this.modelOneService.getPdfs().subscribe(data => {
          this.pdfs = data;
          this.error = null;
        }, error => {
          this.error = error;
          this.pdfs = null;
        });
      } else {
        this.modelOneService.getPdfs(form.value.search).subscribe(data => {
          this.pdfs = data;
          this.error = null;
        }, error => {
          this.error = error;
          this.pdfs = null;
        });
      }
    }
  }

}
