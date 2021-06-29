import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Bordereau} from '../../../models/bordereau.model';
import {BordereauService} from '../bordereau/bordereau.service';

@Component({
  selector: 'app-bordereau-hviwer',
  templateUrl: './bordereau-hviwer.component.html',
  styleUrls: ['./bordereau-hviwer.component.css']
})
export class BordereauHviwerComponent implements OnInit {
  bordereau: Bordereau;
  image = new Image();
  linksource: any;

  constructor(private rt: ActivatedRoute, private bordereauService: BordereauService, private route: Router) {
  }

  ngOnInit(): void {
    this.rt.params.subscribe(d => {
      this.bordereauService.getBordereau(d.ref).subscribe(data => {
        this.bordereau = data;
        this.linksource = this.bordereau.pdf;
      });
    });
  }


  deleteBordereau(ref: string): void {
    this.bordereauService.deleteBordereau(btoa(ref)).subscribe(data => {
      if (data === null) {
        this.route.navigate(['/bordereaushistory']).then(null);
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
