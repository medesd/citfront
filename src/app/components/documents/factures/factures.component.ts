import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';
import {AuthService} from '../../auth/auth.service';
import {Pdf} from '../../../models/pdf.model';
import {ProjectService} from '../../project/project.service';
import {Project} from '../../../models/project.model';
import {FacturesService} from './factures.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.css']
})
export class FacturesComponent implements OnInit {
  show = false;
  facture: Facture;
  prixNum = 1;
  oldFacture: { added: boolean, button: string } = {added: false, button: 'Ajouter un facture'};
  form: FormGroup;
  restTotal = 0;
  database = false;
  imp = false;
  image = new Image();
  numPages = 1;
  src: any;
  page1: {
    prix: string,
    designation: string,
    unite: string,
    quentite: string,
    prixUnitaire: string,
    montant: string,
  }[] = [];

  pages: {
    prix: string,
    designation: string,
    unite: string,
    quentite: string,
    prixUnitaire: string,
    montant: string,
  }[][] = [];
  projects: Project[];

  get getDate(): string {
    const d = new Date();

    const year = d.getFullYear();
    let day;
    if (d.getDate() < 9) {
      day = '0' + d.getDate();
    } else {
      day = d.getDate();
    }
    let month;
    if ((d.getMonth() + 1) < 9) {
      month = '0' + (d.getMonth() + 1);
    } else {
      month = (d.getMonth() + 1);
    }
    return [year, month, day].join('-');
  }

  constructor(private authService: AuthService,
              private projectService: ProjectService,
              private facturesService: FacturesService,
              private toastr: ToastrService) {
  }

  addFacture(): void {
    if (this.oldFacture.added) {
      this.oldFacture.button = 'Ajouter un facture';
      this.oldFacture.added = false;
    } else {

      this.oldFacture.button = 'Supprimer la facture';
      this.oldFacture.added = true;
    }
  }

  switchPages(): void {
    this.numPages++;
    if (this.facture.facture.length <= 13) {
      if (this.facture.facture.length > 8) {
        this.pages.push(this.facture.facture.splice(0, this.facture.facture.length - 3));
      }
      this.pages.push(this.facture.facture);
      return;
    }
    this.pages.push(this.facture.facture.splice(0, 13));
    this.switchPages();
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid && this.src) {
      const ref = this.form.get('factureNum').value;
      const some = await this.facturesService.getFacture(btoa(ref)).toPromise();
      if (some != null) {
        this.toastr.error(ref + ' deja exist');
      } else {
        this.pages = [];
        this.show = !this.show;
        this.facture = this.form.value;
        this.form.get('signature').setValue(null);
        this.facture.signature = this.src;
        if (this.facture.facture.length >= 8) {
          if (this.facture.facture.length > 13) {
            this.page1 = this.facture.facture.splice(0, 13);
          } else {
            this.page1 = this.facture.facture.splice(0, 8);
          }
        } else {
          this.page1 = this.facture.facture.splice(0, this.facture.facture.length);
        }
        if (this.facture.facture.length > 0) {
          this.switchPages();
        }
      }

    }
  }

  get fetchFacture(): AbstractControl[] {
    return (this.form.get('facture') as FormArray).controls;
  }

  fetchImage(evt: any): void {
    if (evt.target.files[0] != null) {
      const file = new FileReader();
      file.onload = (e) => {
        this.src = e.target.result;
      };
      file.readAsDataURL(evt.target.files[0]);
    }
  }

  sendPdf(blob: Blob, fileName: string, reference: string): void {
    const f = new FormData();
    const pdf = new Pdf(reference, fileName, null);
    f.append('pdf', blob, fileName);
    f.append('info', JSON.stringify(pdf));
    this.facturesService.sendFacture(f).subscribe(data => console.log(data));
  }

  reshow(): void {
    this.pages = [];
    this.show = !this.show;
  }

  addNewFacture(): void {
    if (isNaN(+this.form.get('ttc').value - (+this.form.get('oldFacture').value))) {
      return;
    }
    this.form.get('restTotal').setValue((+this.form.get('ttc').value - (+this.form.get('oldFacture').value)).toFixed(2));
  }

  getTotal(): void {
    let somme = 0;
    (this.form.get('facture') as FormArray).controls.forEach(p => {
      if (p.get('montant').value !== null) {
        somme += parseFloat(p.get('montant').value);
      }
    });
    if (isNaN(somme)) {
      this.form.get('total').setValue('0');
      this.form.get('tva').setValue('0');
      this.form.get('tva').setValue('0');
    } else {
      this.form.get('total').setValue(somme.toFixed(2));
      this.form.get('tva').setValue((somme * 0.2).toFixed(2));
      this.form.get('ttc').setValue(((somme * 0.2) + somme).toFixed(2));
    }
  }

  calcMontant(index: number): void {
    const quentite = +(this.form.get('facture') as FormArray).at(index).get('quentite').value;
    const prixUnitaire = +(this.form.get('facture') as FormArray).at(index).get('prixUnitaire').value;
    const total = quentite * prixUnitaire;
    if (!isNaN(total)) {
      if (quentite * prixUnitaire > 0) {
        (this.form.get('facture') as FormArray).at(index).get('montant').setValue(total.toFixed(2));
      } else {
        (this.form.get('facture') as FormArray).at(index).get('montant').setValue(null);
      }
    } else {
      (this.form.get('facture') as FormArray).at(index).get('montant').setValue(null);
    }
  }

  manageControl(type: boolean): void {
    if (type) {
      this.prixNum++;
    } else {
      if (this.prixNum > 1) {
        this.prixNum--;
      }
    }
    const con = new FormGroup({
      prix: new FormControl(this.prixNum),
      designation: new FormControl(null, Validators.required),
      unite: new FormControl(null, Validators.required),
      quentite: new FormControl(null, Validators.required),
      prixUnitaire: new FormControl(null, Validators.required),
      montant: new FormControl({value: '0'}),
    });
    const p = this.form.get('facture') as FormArray;
    if (type) {
      p.push(con);
    } else {
      if (p.length > 1) {
        p.removeAt(p.length - 1);
      }
    }
  }

  public captureScreen(print: boolean): void {
    this.imp = true;
    this.authService.hideheader();
    setTimeout(() => {
      const width = document.body.style.width;
      document.body.style.width = '950px';
      html2canvas(document.body, {scale: 1}).then(canvas => {
        canvas.style.opacity = '1';
        this.image.src = canvas.toDataURL();
        const pdf = new jsPDF('p', 'px', 'a4');
        const x = -25;
        pdf.addImage(this.image, 'png', -x, 0, canvas.width / 2.4, 0, null, 'MEDIUM');
        const pageheight = -630;
        if (this.numPages > 1) {
          for (let i = 0; i <= this.numPages; i++) {
            pdf.addPage();
            pdf.addImage(this.image, 'png', -x, pageheight * (i + 1), canvas.width / 2.4, 0, null, 'MEDIUM');
          }
          pdf.deletePage(pdf.getNumberOfPages());
        }
        pdf.close();
        if (!this.database) {
          const ref: { ref: number, year: number } = JSON.parse(localStorage.getItem('facture'));
          ref.ref++;
          localStorage.setItem('facture', JSON.stringify(ref));
          this.sendPdf(pdf.output('blob'), this.form.get('project').value.replace(/\s/g, '_'), this.form.get('factureNum').value);
          this.database = true;
        }
        if (print) {
          pdf.autoPrint();
          pdf.output('dataurlnewwindow');
        } else {
          pdf.save(this.form.get('factureNum').value.replace(/-/g, '_').replace(/\//g, '_') + '.pdf');
        }
      });
      this.authService.hideheader();
      this.imp = false;
      document.body.style.width = width;

    }, 100);
  }

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      project: new FormControl(null, Validators.required),
      dateIn: new FormControl(this.getDate, Validators.required),
      client: new FormControl(null, Validators.required),
      factureNum: new FormControl(null, Validators.required),
      oldFacture: new FormControl(null),
      ttc: new FormControl(null),
      tva: new FormControl(null),
      total: new FormControl(null),
      restTotal: new FormControl(null),
      signature: new FormControl(null),
      facture: new FormArray([new FormGroup({
        prix: new FormControl(this.prixNum),
        designation: new FormControl(null, Validators.required),
        unite: new FormControl(null, Validators.required),
        quentite: new FormControl(null, Validators.required),
        prixUnitaire: new FormControl(null, Validators.required),
        montant: new FormControl(null, Validators.required),
      })]),
    });

    this.projects = await this.projectService.getProjects();

    let ref: { ref: number, year: number } = JSON.parse(localStorage.getItem('facture'));
    if (ref === null) {
      ref = {ref: 1, year: new Date().getFullYear()};
      localStorage.setItem('facture', JSON.stringify(ref));
    }
    let reference = null;
    if (ref.ref < 10) {
      reference = 'CIT/00' + ref.ref + '/' + ref.year;
    } else if (ref.ref < 100) {
      reference = 'CIT/0' + ref.ref + '/' + ref.year;
    } else if (ref.ref >= 100) {
      reference = 'CIT/' + ref.ref + '/' + ref.year;
    }
    (this.form.get('factureNum') as FormControl).setValue(reference);
  }

}

class Facture {
  constructor(public project: string,
              public dateIn: Date,
              public client: string,
              public factureNum: string,
              public facture: {
                prix: string,
                designation: string,
                unite: string,
                quentite: string,
                prixUnitaire: string,
                montant: string,
              }[],
              public signature: any,
              public oldFacture?: string,
              public tva?: string,
              public ttc?: string,
              public total?: string,
              public restTotal?: string) {
  }
}
