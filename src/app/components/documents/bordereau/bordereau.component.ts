import {Component, ComponentFactoryResolver, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {Project} from '../../../models/project.model';
import {ProjectService} from '../../project/project.service';
import {NgForm} from '@angular/forms';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';
import {AuthService} from '../../auth/auth.service';
import {Pdf} from '../../../models/pdf.model';
import {BordereauService} from './bordereau.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-bureau',
  templateUrl: './bordereau.component.html',
  styleUrls: ['./bordereau.component.css']
})
export class BordereauComponent implements OnInit {
  childes: { height: number, dsignation: string, numCopies: string, observation: HTMLTableCellElement }[];
  projects: Project[];
  table: { height: number, dsignation: string, numCopies: string, observation: HTMLTableCellElement }[][];
  table1: { height: number, dsignation: string, numCopies: string, observation: HTMLTableCellElement }[];
  project: Project;
  numbers: number[] = [1];
  cellNum = 1;
  ref: string;
  bordereau: Bordereau;
  hides = false;
  image = new Image();
  imp = false;
  numPages = 1;
  database = false;
  @ViewChild('div') refe: ElementRef;
  placeHolder: number[] = [];


  hidediv(): void {
    this.hides = !this.hides;
  }

  deleteCell(e): void {
    let b = e.path[4] as HTMLTableCellElement;
    const x = e.path as HTMLElement[];
    x.forEach(p => {
      if (p.tagName === 'TD') {
        b = p as HTMLTableCellElement;
      }
    });
    try {
      if (b.rowSpan === 4) {
        return;
      }
      if (b.rowSpan === 3) {
        b.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.childNodes[2].remove();
        b.rowSpan = 4;
        return;
      }
      if (b.rowSpan === 2) {
        b.parentElement.nextElementSibling.nextElementSibling.childNodes[2].remove();
        b.rowSpan = 3;
        return;
      }
      b.parentElement.nextElementSibling.childNodes[2].remove();
      b.rowSpan = 2;
    } catch (ex) {
      console.log(ex);
    }
  }

  async onSubmit(form: NgForm): Promise<void> {

    if (form.valid) {
      this.ref = form.value.refCourrier;
      const some = await this.bordereauService.getBordereau(btoa(this.ref)).toPromise();
      if (some != null) {
        this.toastr.error(this.ref + ' deja exist');
      } else {
        this.childes = [];
        this.table1 = [];
        this.table = [];
        this.inisialize();
        this.bordereau = form.value;
        if (this.table?.toString()?.trim() === '') {
          this.table = null;
        }
        this.numPages = this.table?.length + 1;
        if (isNaN(this.numPages)) {
          this.numPages = 1;
        }
        this.hides = !this.hides;
      }
    }
  }


  constructor(private projectService: ProjectService,
              private authService: AuthService,
              private bordereauService: BordereauService,
              private render: Renderer2,
              private toastr: ToastrService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  async ngOnInit(): Promise<void> {
    this.placeHolder.push(0);
    this.placeHolder.push(0);
    this.projects = await this.projectService.getProjects();
    this.make_ref();
  }

  showSome(e): void {
    console.log(e);
  }

  getProjects(evt): void {
    this.project = this.projects.find(d => d.nom_PROJECT === evt.value);
  }

  get getDate(): Date {
    return new Date(Date.now());
  }

  make_ref(): void {
    if (localStorage.getItem('b_ref') == null) {
      localStorage.setItem('b_ref', JSON.stringify({ref: 1, year: new Date(Date.now()).getFullYear()}));
    }
    const form: { ref: number, year: number } = JSON.parse(localStorage.getItem('b_ref'));
    if (form.ref < 10) {
      this.ref = 'CIT/BDE00' + form.ref + '/' + form.year + '/AB/HB';
    } else if (form.ref < 100) {
      this.ref = 'CIT/BDE0' + form.ref + '/' + form.year + '/AB/HB';
    } else if (form.ref >= 100) {
      this.ref = 'CIT/BDE' + form.ref + '/' + form.year + '/AB/HB';
    }
  }

  inisialize(): void {
    const table = document.getElementById('table') as HTMLElement;
    this.childes = [];
    table.childNodes[1].childNodes.forEach((p, i) => {
      if (i !== table.childNodes[1].childNodes.length - 1) {
        const height = (p as HTMLElement).clientHeight;
        const dsi = (p.childNodes[0].childNodes[0] as HTMLElement);

        const dsignation = dsi.innerHTML.split('class="border"').join('').split('contenteditable="true"').join('');
        const numCopies = (p.childNodes[1].childNodes[0] as HTMLElement).innerHTML;
        let observation: HTMLTableCellElement = null;
        if (p.childNodes[2] !== undefined) {
          if (p.childNodes[2].nodeType === 8) {
            p.childNodes[2].remove();
          }
          if (p.childNodes[2].nodeType !== 8) {
            observation = (p.childNodes[2] as HTMLTableCellElement);
          }
        }
        this.childes.push({height, dsignation, numCopies, observation});
      }
    });

    const list1 = this.childes.slice();
    while (list1.reduce((prev, cur) => prev + cur.height, 0) > 600) {
      list1.pop();
    }
    /*let empty = false;
    let i = 0;*/
    this.table1 = list1;
    this.childes = this.childes.splice(list1.length);
    this.makeTable(this.childes);
  }

  /*popList(i: number, list: any[]): void {
    list.p;
  }*/

  makeTable(list: { height: number, dsignation: string, numCopies: string, observation: HTMLTableCellElement }[]): void {
    const list1 = list.slice();
    if (list1.reduce((prev, cur) => prev + cur.height, 0) <= 1700) {
      this.table.push(list);
      return;
    }
    while (list1.reduce((prev, cur) => prev + cur.height, 0) >= 1700) {
      list1.pop();
    }
    this.table.push(list1);
    list = list.slice(list1.length);
    this.makeTable(list);
  }

  some(e): void {
    if (e.target.clientHeight >= 480) {
      const allowedKeys = [8, 37, 38, 39, 40, 46];
      if (allowedKeys.indexOf(e.keyCode) === -1) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  hide(e): any {
    e.target.style.display = 'none';
    e.path[1].style.display = 'none';
  }

  addNewCell(type: boolean): void {

    if (type) {
      this.cellNum++;
      this.numbers.push(this.cellNum);
    } else if (this.numbers.length > 1) {
      this.numbers.splice(this.numbers.length - 1, 1);
      this.cellNum--;
    }
  }

  public captureScreen(print: boolean): void {
    this.imp = true;
    this.authService.hideheader();
    setTimeout(() => {
      const width = document.body.style.width;
      document.body.style.width = '960px';
      html2canvas(document.body, {scale: 1}).then(canvas => {
        canvas.style.opacity = '1';
        this.image.src = canvas.toDataURL();
        const pdf = new jsPDF('p', 'px', 'a4');
        const x = -22;
        pdf.addImage(this.image, 'png', -x, 0, canvas.width / 2.4, 0, null, 'FAST');
        if (this.numPages > 1) {
          for (let i = 0; i <= this.numPages; i++) {
            pdf.addPage();
            pdf.addImage(this.image, 'png', -x, -630 * (i + 1), canvas.width / 2.4, 0, null, 'FAST');
          }
          pdf.deletePage(pdf.getNumberOfPages());
        }
        pdf.close();
        if (!this.database) {
          const ref: number = +this.ref.substring(7, 10);
          const year: number = +this.ref.substring(11, 15);
          localStorage.setItem('b_ref', JSON.stringify({ref: ref + 1, year}));
          this.sendPdf(pdf.output('blob'), this.project.nom_PROJECT, this.ref);
          this.database = true;
        }
        if (print) {
          pdf.autoPrint();
          pdf.output('dataurlnewwindow');
        } else {
          pdf.save(this.ref.replace(/-/g, '_').replace(/\//g, '_') + '.pdf');
        }
      });
      this.authService.hideheader();
      this.imp = false;
      document.body.style.width = width;

    }, 100);
  }

  sendPdf(blob: Blob, fileName: string, reference: string): void {
    const f = new FormData();
    const pdf = new Pdf(reference, fileName, null);
    f.append('pdf', blob, fileName);
    f.append('info', JSON.stringify(pdf));
    this.bordereauService.sendBordereau(f).subscribe(data => console.log(data));
  }

  addCell(e): void {
    document.getElementById('div').childNodes.forEach(d => {
      if (d.nodeType === 8) {
        d.remove();
      }
    });
    const cell = document.createElement('td');
    cell.className = 'align-middle';
    cell.append(document.getElementById('div').childNodes[0]);
    this.placeHolder.push(0);
    let b = e.path[4] as HTMLTableCellElement;
    const x = e.path as HTMLElement[];
    x.forEach(p => {
      if (p.tagName === 'TD') {
        b = p as HTMLTableCellElement;
      }
    });
    try {
      if (b.rowSpan === 4) {
        b.rowSpan = 3;
        b.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.append(cell);
        return;
      }
      if (b.rowSpan === 3) {
        b.rowSpan = 2;
        b.parentElement.nextElementSibling.nextElementSibling.append(cell);
        return;
      }
      if (b.rowSpan === 2) {
        b.rowSpan = 1;
        b.parentElement.nextElementSibling.append(cell);
        return;
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  removeBorder(s: string): string {
    return s.split('class="border"').join('').split('contenteditable="true"').join('');
  }
}


class Bordereau {
  constructor(public project: string,
              public date: Date,
              public numDossier: string,
              public maitreDeLouvrage: string,
              public destinataire: string,
              public refCourrier: string,
              public information: boolean,
              public attribution: boolean,
              public approbation: boolean,
              public avis: boolean,
              public diffusion: boolean,
              public notification: boolean,
              public execution: boolean
  ) {
  }
}
