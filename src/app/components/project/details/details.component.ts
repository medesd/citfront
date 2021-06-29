import {Component, OnInit} from '@angular/core';
import {PilotesTypes, Project} from '../../../models/project.model';
import {ProjectService} from '../project.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PiloteService} from '../../pilote/pilote.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  project: Project;
  sub: any;
  id: string;
  loding = false;

  constructor(public projectService: ProjectService,
              private route: Router,
              private piloteService: PiloteService,
              private rt: ActivatedRoute) {
  }

  async ngOnInit() {
    await this.piloteService.getPilotesNames();
    this.sub = this.rt.params.subscribe(params => {
      this.id = params.id;
      this.projectService.getProjectById(this.id).subscribe(data => {
        this.project = data;
        this.project.pilotes = [];
        this.piloteService.pilotesNames.forEach(d => {
          if (this.project.pilote === d.id) {
            this.project.pilotes.push({...d, type: PilotesTypes.pilote});
          }
          if (this.project.electricite === d.id) {
            this.project.pilotes.push({...d, type: PilotesTypes.electricite});
          }
          if (this.project.structure === d.id) {
            this.project.pilotes.push({...d, type: PilotesTypes.structure});
          }
          if (this.project.fluide === d.id) {
            this.project.pilotes.push({...d, type: PilotesTypes.fluide});
          }
          if (this.project.vrd === d.id) {
            this.project.pilotes.push({...d, type: PilotesTypes.vrd});
          }
          if (this.project.cps === d.id) {
            this.project.pilotes.push({...d, type: PilotesTypes.cps});
          }
        });
        this.loding = true;
      });
    });
  }

  getName(id: string, type: PilotesTypes) {
    let name;
    const i = this.project.pilotes.findIndex(u => {
      return u !== null && u.id === id;
    });
    if (i !== -1) {
      name = this.project.pilotes.find(r => {
        if (r.id === id) {
          switch (type) {
            case PilotesTypes.vrd:
              return r;
            case PilotesTypes.structure:
              return r;
            case PilotesTypes.fluide:
              return r;
            case PilotesTypes.pilote:
              return r;
            case PilotesTypes.electricite:
              return r;
            case PilotesTypes.cps:
              return r;
          }
        }
      }).last_name;
    } else {
      name = null;
    }

    if (name === undefined) {
      name = null;
    }

    return name;
  }

  getPiloteNames(name: string): any {
    let id1, id2, name1, name2;
    name1 = name.substring(0, name.indexOf('&')).trim();
    name2 = name.substring(name.indexOf('&') + 1).trim();
    const i = this.piloteService.pilotesNames.findIndex(p => p !== null && p.last_name == name1);
    const j = this.piloteService.pilotesNames.findIndex(p => p !== null && p.last_name == name2);
    if (i != -1 && j != -1) {
      id1 = this.piloteService.pilotesNames.find(p => p.last_name == name1).id;
      id2 = this.piloteService.pilotesNames.find(p => p.last_name == name2).id;
      return {id1, id2, name1, name2};
    }
    if (i != -1) {
      id1 = this.piloteService.pilotesNames.find(p => p.last_name == name1).id;
      return {name1, id1};
    }
    if (j != -1) {
      id2 = this.piloteService.pilotesNames.find(p => p.last_name == name2).id;
      return {name2, id2};
    }
    return null;
  }

  deleteProject(id: string) {
    this.projectService.deleteProject(id).subscribe(() => {
      this.route.navigate(['/projectlist']).then(() => {
      });
    });
  }


  checkAdmin() {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user')).roles.indexOf('ROLE_ADMIN') !== -1;
    } else {
      return null;
    }
  }

}
