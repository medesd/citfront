import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../project/project.service';
import {Project} from '../../../models/project.model';
import {NgForm} from '@angular/forms';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';
import {AuthService} from '../../auth/auth.service';
import {Pdf} from '../../../models/pdf.model';
import {ModelOneService} from './model-one.service';
import {SummernoteOptions} from 'ngx-summernote/lib/summernote-options';
import {ToastrService} from 'ngx-toastr';




@Component({
  selector: 'app-model-one',
  templateUrl: './model-one.component.html',
  styleUrls: ['./model-one.component.css'],
})
export class ModelOneComponent implements OnInit {
  evt = [];
  n: any;
  m: any;
  projects: Project[];
  cookie: string;
  year: number;
  ref: any;
  model1: Model1;
  cons = true;
  src: any;
  numPages = 1;
  imp = false;
  pageNum: number[] = [];
  image = new Image();
  database = false;
  submit: boolean;
  default = {
    placeholder: '',
    tabsize: 2,
    lineHeights: ['1.0', '1.2', '1.4', '1.6', '1.8', '2.0'],
    disableDragAndDrop: true,
    toolbar: [
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
      ['fontsize', ['fontsize', 'color']],
      ['para', ['ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
  };
  config1: SummernoteOptions = {
    ...this.default,
    callbacks: {
      onInit: (e) => {
        e.statusbar[0].style.display = 'none';
        e.editable[0].style.overflow = 'hidden';
        e.editable[0].style.height = 'auto';
        e.editable[0].style.maxHeight = '540px';
        this.evt.push(e);
        this.m = e;
      },
      onChange: (e, v) => {
        this.m.editable[0] = v[0];
      },
      onKeydown: (e) => {
        if (this.m.editable[0].scrollHeight > 220) {
          if (this.numPages < 2) {
            this.numPages++;
            this.pageNum.push(this.numPages);
          }
        }
        if (this.m.editable[0].scrollHeight > 540) {
          const allowedKeys = [8, 37, 38, 39, 40, 46];
          if (allowedKeys.indexOf(e.keyCode) === -1) {
            e.preventDefault();
            e.stopPropagation();
          }
        }

      }
    }
  };
  config2: SummernoteOptions = {
    ...this.default,
    callbacks: {
      onInit: (e) => {
        e.statusbar[0].style.display = 'none';
        e.editable[0].style.overflow = 'hidden';
        e.editable[0].style.height = 'auto';
        this.evt.push(e);
        this.n = e;
        this.n.editable[0].style.maxHeight = (440 - this.m.editable[0]).toString() + 'px';
      },
      onChange: () => {
        this.n.editable[0].style.maxHeight = (440 - this.m.editable[0].clientHeight).toString() + 'px';
        if ((this.m.editable[0].clientHeight + this.n.editable[0].clientHeight) > 304) {
          if (this.numPages < 2) {
            this.numPages++;
            this.pageNum.push(this.numPages);
          }
        }
      },
      onKeydown: (e) => {
        if (this.n.editable[0].scrollHeight > (440 - this.m.editable[0].clientHeight)) {
          const allowedKeys = [8, 37, 38, 39, 40, 46];
          if (allowedKeys.indexOf(e.keyCode) === -1) {
            e.preventDefault();
            e.stopPropagation();
            console.log(e);
          }
        }

      }
    }
  };
  config: SummernoteOptions = {
    height: 1000,
    ...this.default,
    callbacks: {
      onInit: (e) => {
        this.evt.push(e);
        e.statusbar[0].style.display = 'none';
        e.editable[0].style.overflow = 'hidden';
      },
      onKeydown: (e) => {
        if (e.currentTarget.scrollHeight > 1004) {
          const allowedKeys = [8, 37, 38, 39, 40, 46];
          if (allowedKeys.indexOf(e.keyCode) === -1) {
            e.preventDefault();
            e.stopPropagation();
          }
        }

      }
    }
  };

  get max1(): boolean {
    return this.m.editable[0].clientHeight > 380;
  }


  constructor(private projectService: ProjectService,
              private authService: AuthService,
              private modelOneService: ModelOneService,
              private toastr: ToastrService) {
  }


  sendPdf(blob: Blob, fileName: string, reference: string): void {
    const f = new FormData();
    const pdf = new Pdf(reference, fileName, null);
    f.append('pdf', blob, fileName);
    f.append('info', JSON.stringify(pdf));
    this.modelOneService.sendPdf(f).subscribe(data => console.log(data));
  }


  formatDate = () => new Date(Date.now());
  editInfo = () => this.cons = true;

  addNewPage(): void {
    this.numPages++;
    this.pageNum.push(this.numPages);
  }

  removeNewPage(): void {
    if (this.pageNum.length <= 1) {
      if (document.getElementById('signrem').clientHeight <= 1242) {
        this.pageNum = [];
        this.numPages = 1;
      }

    } else {

      this.pageNum = this.pageNum.filter(p => {
        return p !== this.numPages;
      });
      this.numPages -= 1;
    }
  }

  makeSignature(event: any): File {
    return event.target.files[0];
  }

  async ngOnInit(): Promise<void> {
    this.cookie = (+localStorage.getItem('ref') + 1).toString();
    this.year = new Date().getFullYear();
    this.projects = await this.projectService.getProjects();
  }

  async make_ref(form: NgForm): Promise<void> {
    if (form.valid) {

      if (+form.value.referance < 10) {
        this.ref = 'CIT-PV00' + form.value.referance + '/' + form.value.year + '/KK/KB';
      } else if (+form.value.referance < 100) {
        this.ref = 'CIT-PV0' + form.value.referance + '/' + form.value.year + '/KK/KB';
      } else if (+form.value.referance >= 100) {
        this.ref = 'CIT-PV' + form.value.referance + '/' + form.value.year + '/KK/KB';
      }
      const some = await this.modelOneService.getPdf(btoa(this.ref)).toPromise();
      if (some != null) {
        this.submit = false;
        this.toastr.error(this.ref + ' deja exist');
      } else {
        this.submit = true;
      }
    }
  }

  onSubmit(f: NgForm): void {
    if (f.valid) {
      setTimeout(() => {
        this.model1.ref = this.ref;
        this.cons = false;
        this.onFileViewed(f.value.signature);
        this.model1 = f.value;
      }, 100);

    }
  }

  sendToImp(evt): void {
    const p = this.projects.findIndex(r => r.nom_PROJECT === evt.target.value);
    if (p !== -1) {
      if (this.model1 != null) {
        this.model1 = new Model1(this.projects[p].nom_PROJECT,
          this.projects[p].num_MARCHE, this.projects[p].maitre_DOUVRAGE,
          this.projects[p].id,
          this.model1.date,
          this.model1.mc,
          this.model1.nm,
          this.model1.acr,
          this.model1.signature,
          this.ref);
      } else {
        this.model1 = new Model1(this.projects[p].nom_PROJECT,
          this.projects[p].num_MARCHE,
          this.projects[p].maitre_DOUVRAGE,
          this.projects[p].id,
          new Date(Date.now()));
      }
    }
  }


  onFileViewed(evt: File): void {
    if (evt) {
      const files = new FileReader();
      files.onload = (e) => {
        this.src = e.target.result;
      };
      files.readAsDataURL(evt);
      return this.src;
    }
    return null;
  }

  public captureScreen(print: boolean): void {
    this.imp = true;
    this.evt.forEach(e => {
      e.toolbar[0].style.display = 'none';
    });
    this.authService.hideheader();
    setTimeout(() => {
      const width = document.body.style.width;
      document.body.style.width = '950px';
      html2canvas(document.body, {scale: 1}).then(canvas => {
        canvas.style.opacity = '1';
        this.image.src = canvas.toDataURL();
        this.evt.forEach(e => {
          e.toolbar[0].style.display = 'block';
        });
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
          localStorage.setItem('ref', (+this.cookie + 1).toString());
          this.sendPdf(pdf.output('blob'), this.model1.affaire.replace(/\s/g, '_'), this.ref);
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


}

export class Model1 {
  constructor(public affaire: string,
              public numMarche: string,
              public maitreDouvrage: string,
              public numDosser: string,
              public date: Date,
              public mc?: string,
              public nm?: string,
              public acr?: string,
              public signature?: File,
              public ref?: string) {
  }

}
