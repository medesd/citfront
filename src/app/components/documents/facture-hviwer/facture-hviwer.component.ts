import {Component, OnInit} from '@angular/core';
import {Bordereau} from '../../../models/bordereau.model';
import {ActivatedRoute, Router} from '@angular/router';
import {BordereauService} from '../bordereau/bordereau.service';
import {FacturesService} from '../factures/factures.service';

@Component({
  selector: 'app-facture-hviwer',
  templateUrl: './facture-hviwer.component.html',
  styleUrls: ['./facture-hviwer.component.css']
})
export class FactureHviwerComponent implements OnInit {


  bordereau: Bordereau;
  image = new Image();
  linksource: any;

  constructor(private rt: ActivatedRoute, private facturesService: FacturesService, private route: Router) {
  }

  ngOnInit(): void {
    this.rt.params.subscribe(d => {
      this.facturesService.getFacture(d.ref).subscribe(data => {
        this.bordereau = data;
        this.linksource = this.bordereau.pdf;
      });
    });
  }


  deleteBordereau(ref: string): void {
    this.facturesService.deleteFacture(btoa(ref)).subscribe(data => {
      if (data === null) {
        this.route.navigate(['/factureshistory']).then(null);
      }
    });
  }

  showPdf(): void {
    const linkSource = 'data:application/pdf;base64,' + this.linksource;
    const downloadLink = document.createElement('a');
    const fileName = this.bordereau.reference.replace(/\//g, '_');

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }


}
