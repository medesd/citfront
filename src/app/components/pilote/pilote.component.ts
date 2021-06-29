import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PiloteService} from './pilote.service';
import {Pilote} from '../../models/pilote.model';
import {Project} from '../../models/project.model';
import {ProjectService} from '../project/project.service';

@Component({
  selector: 'app-pilote',
  templateUrl: './pilote.component.html',
  styleUrls: ['./pilote.component.css']
})
export class PiloteComponent implements OnInit {
  pilote: Pilote;
  details: PiloteDetails = PiloteDetails.details;
  project_en: Project[] = [];
  projects: Project[];
  project_fin: Project[] = [];
  id: string;
  project: Project;
  sub: any;
  set: boolean = false;
  some: Project[] = [];


  constructor(public piloteService: PiloteService, private route: Router, private projectService: ProjectService, private rt: ActivatedRoute) {

  }

  async ngOnInit() {
    this.sub = await this.rt.params.subscribe(params => {
      this.id = params['id'];
    });
    const data = await this.projectService.getProjects();
    this.pilote = await this.piloteService.getPilote(this.id).toPromise();
    let pilotes = await this.piloteService.getAllPilotes().toPromise();
    const fp = pilotes.filter(y => y.nom.indexOf('&') != -1);
    fp.forEach(g => {
      let n = this.pilote.id;
      if (this.pilote.nom.trim() == g.nom.substring(0, g.nom.indexOf('&')).trim() || this.pilote.nom.trim() == g.nom.substring(g.nom.indexOf('&') + 1, g.nom.length).trim()) {
        this.some.push(...data.filter(p => g.id == p.pilote));
      }

    });
    this.projects = this.some.filter(p => {
      let fk = 1;
      if (p.electricite == this.pilote.id) {
        fk += 1;
      }
      if (p.vrd == this.pilote.id) {
        fk += 1;
      }
      if (p.structure == this.pilote.id) {
        fk += 1;
      }
      if (p.fluide == this.pilote.id) {
        fk += 1;
      }
      if (p.cps == this.pilote.id) {
        fk += 1;
      }
      if (fk == 1) {
        return p;
      }
    });
    const plp = await this.piloteService.getPiloteProjects(this.id).toPromise();
    this.projects.push(...plp);

    this.project_en = this.projects.filter(p => p.anne_FIN === null || p.anne_FIN === '' || p.anne_FIN.indexOf('-') != -1 || p.anne_FIN > new Date(Date.now()).getFullYear().toString());
    this.project_fin = this.projects.filter(p => +p.anne_FIN > 2000);
    this.details = PiloteDetails.details;
  }


  removePilote(id: string) {
    this.piloteService.removePilote(id).subscribe(() => {
      this.route.navigate(['/pilotes']).then(() => {
      });
    });
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    if (year === 1970) {
      return null;
    } else {
      return [day, month, year].join('/');
    }
  }

  onEdit(evt: Pilote) {
    if (evt) {
      //this.pilote = evt;
      this.piloteService.getPilote(this.pilote.id).subscribe(data => {
        this.pilote = data;
        this.set = false;
      });
    }
  }

  checkAdmin() {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user')).roles.indexOf('ROLE_ADMIN') !== -1;
    } else {
      return null;
    }
  }


  showPilote(details: PiloteDetails) {
    switch (details) {
      case PiloteDetails.details:
        this.details = PiloteDetails.details;
        break;
      case PiloteDetails.projects_en:
        this.details = PiloteDetails.projects_en;
        break;
      case PiloteDetails.projects_fin:
        this.details = PiloteDetails.projects_fin;
        break;
      default:
        this.details = details;
        break;
    }
  }
}

enum PiloteDetails {
  details,
  projects_en,
  projects_fin
}
