import {Component, OnInit} from '@angular/core';
import {Pdf} from '../../../models/pdf.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ModelOneService} from '../model-one/model-one.service';

@Component({
  selector: 'app-model-hviwer',
  templateUrl: './model-hviwer.component.html',
  styleUrls: ['./model-hviwer.component.css']
})
export class ModelHviwerComponent implements OnInit {
  pdf: Pdf;
  image = new Image();
  linksource: any;

  constructor(private rt: ActivatedRoute, private modelOneService: ModelOneService, private route: Router) {
  }

  ngOnInit(): void {
    this.rt.params.subscribe(d => {
      this.modelOneService.getPdf(d.ref).subscribe(data => {
        this.pdf = data;
        this.linksource = this.pdf.pdf;
      });
    });
  }


  deleteModel(ref: string): void {
    this.modelOneService.deletePdf(btoa(ref)).subscribe(data => {
      if (data === null) {
        this.route.navigate(['/modelshistory']).then(null);
      }
    });
  }

  showPdf(): void {
    const linkSource = 'data:application/pdf;base64,' + this.linksource;
    const downloadLink = document.createElement('a');
    const fileName = this.pdf.reference.replace(/\//g, '_');

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

}
