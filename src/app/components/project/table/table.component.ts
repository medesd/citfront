import {Component, OnInit} from '@angular/core';
import {PilotesTypes, Project} from '../../../models/project.model';
import {ProjectService} from '../project.service';
import {Pilote} from '../../../models/pilote.model';
import {PiloteService} from '../../pilote/pilote.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  tableModel: Project[];
  pilote: Pilote;
  lodding = false;
  search = false;

  constructor(private projectService: ProjectService, private piloteService: PiloteService) {
  }

  async setup(): Promise<void> {
    this.tableModel.forEach(d => {
      d.pilotes = [];
    });
    await this.piloteService.getPilotesNames();
    this.tableModel.forEach(d => {
      this.piloteService.pilotesNames.forEach(r => {
        if (r.id === d.pilote) {
          d.pilotes.push({...r, type: PilotesTypes.pilote});
        }
        if (r.id === d.electricite) {
          d.pilotes.push({...r, type: PilotesTypes.electricite});
        }
        if (r.id === d.vrd) {
          d.pilotes.push({...r, type: PilotesTypes.vrd});
        }
        if (r.id === d.structure) {
          d.pilotes.push({...r, type: PilotesTypes.structure});
        }
        if (r.id === d.fluide) {
          d.pilotes.push({...r, type: PilotesTypes.fluide});
        }
      });
    });
  }

  async ngOnInit(): Promise<void> {
    this.tableModel = await this.projectService.getProjects();
    await this.setup();
    this.lodding = true;
  }


  async onSubmit(frm: NgForm): Promise<void> {
    this.search = true;
    if (frm.value.value.trim().length < 1) {
      this.tableModel = await this.projectService.getProjects();
      await this.setup();
      this.search = false;
    } else {
      this.projectService.sendProject(frm.value.value).subscribe(data => {
        this.tableModel = data;
        this.setup();
        this.search = false;
      });
    }
  }

  getName(id: string): string {
    let name: string = null;
    if (id != null) {
      const i = this.piloteService.pilotesNames.findIndex(p => p !== null && p.id === id);
      if (i !== -1) {
        name = this.piloteService.pilotesNames.find(p => {
          return p.id === id;
        }).last_name;
      } else {
        name = null;
      }

    }
    return name;
  }

  getPiloteIdByName(name: string): string {
    const i = this.piloteService.pilotesNames.findIndex(p => p !== null && p.last_name === name);
    if (i !== -1) {
      return this.piloteService.pilotesNames.find(d => {
        return d.last_name.trim() === name.trim();
      }).id;
    } else {
      return null;
    }
  }

  getPiloteName(name: string): Array<any> {
    return [this.getName(this.getPiloteIdByName(name.substring(0, name.indexOf('&')).trim())),
      this.getName(this.getPiloteIdByName(name.substring(name.indexOf('&') + 1, name.length).trim()))
    ];
  }

  checkAdmin(): boolean {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user')).roles.indexOf('ROLE_ADMIN') !== -1;
    } else {
      return null;
    }
  }
}
