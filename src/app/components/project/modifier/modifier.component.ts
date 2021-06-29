import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ProjectService} from '../project.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from '../../../models/project.model';
import {PiloteService} from '../../pilote/pilote.service';
import {Pilote} from '../../../models/pilote.model';

@Component({
  selector: 'app-modifier',
  templateUrl: './modifier.component.html',
  styleUrls: ['./modifier.component.css']
})
export class ModifierComponent implements OnInit {
  project: Project;
  id: string;
  vrd: string = null;
  structure: string = null;
  electricite: string = null;
  fluide: string = null;
  pilote: string = null;
  cps: string = null;
  loding = false;
  all = '^[a-zA-Z\\.]+$|^[a-zA-Z\\.]+[ ][a-zA-Z\\.]+$|^[a-zA-Z\\.]+[ ][&][ ][a-zA-Z\\.]+$|^[a-zA-Z\\.]+[ ][a-zA-Z\\.]+[ ][&][ ][a-zA-Z\\.]+$|^[a-zA-Z\\.]+[ ][a-zA-Z\\.]+[ ][&][ ][a-zA-Z\\.]+[ ][a-zA-Z\\.]+$|^[a-zA-Z\\.]+[ ][&][ ][a-zA-Z\\.]+[ ][a-zA-Z\\.]+$';

  constructor(private projectService: ProjectService, public piloteService: PiloteService, private router: Router, private rt: ActivatedRoute) {
  }

  getTheName(p: { id: string, last_name: string }) {
    let name = '';
    if (p.last_name != null) {
      name += p.last_name;
    }
    return name;
  }

  async ngOnInit(): Promise<any> {
    await this.piloteService.getPilotesNames();
    if (!localStorage.getItem('user')) {
      await this.router.navigate(['/signin']);
    }
    this.rt.params.subscribe(d => {
      this.projectService.getProjectById(d['id']).subscribe(data => {
        this.project = data;
        this.id = data.id;
      });
    });

  }

  async getpiloteid(fm: string) {
    if (fm != undefined) {
      let id = null;
      let nom = fm;
      await this.piloteService.getPilotesNames();
      this.piloteService.pilotesNames.forEach(d => {
        if (d.last_name == nom) {
          id = d.id;
        }
      });
      if (id == null) {
        let ps1 = true;
        let ps2 = true;
        if (fm.indexOf('&') != -1) {
          this.piloteService.pilotesNames.forEach(f => {
            if (f.last_name.trim() == nom.substring(0, nom.indexOf('&')).trim()) {
              ps1 = false;
            }
            if (f.last_name.trim() == nom.substring(nom.indexOf('&') + 1, nom.length).trim()) {
              ps2 = false;
            }
          });
          if (ps1) {
            const p1 = new Pilote(null, null, null, null, null, null, nom.substring(0, nom.indexOf('&')).trim(), null);
            await this.piloteService.addPilote(p1).toPromise();
          }
          if (ps2) {
            const p2 = new Pilote(null, null, null, null, null, null, nom.substring(nom.indexOf('&') + 1, nom.length).trim(), null);
            await this.piloteService.addPilote(p2).toPromise();
          }
          const ps = new Pilote(null, null, null, null, null, null, nom, null);
          const p = await this.piloteService.addPilote(ps).toPromise();
          id = p.id;
        } else {
          const p = new Pilote(null, null, null, null, null, null, nom, null);
          const data = await this.piloteService.addPilote(p).toPromise();
          id = data.id;
        }

      }
      return id;
    } else {
      return null;
    }
  }

  async onSubmit(form: NgForm) {

    if (form.valid) {
      this.loding = true;

      let p: Project = form.value;
      p.vrd = await this.getpiloteid(form.value.vrd);
      p.pilote = await this.getpiloteid(form.value.pilote);
      p.fluide = await this.getpiloteid(form.value.fluide);
      p.structure = await this.getpiloteid(form.value.structure);
      p.electricite = await this.getpiloteid(form.value.electricite);
      p.cps = await this.getpiloteid(form.value.cps);

      this.loding = true;
      this.projectService.updateProject(this.id, p).subscribe(data => {
        if (data != null) {
          this.router.navigate(['/details', this.id]);
          this.loding = false;
        }
      });

      await this.piloteService.getPilotesNames();
    }
  }

  getName(id: string) {
    let name = '';

    this.piloteService.pilotesNames.forEach(d => {
      if (d.id === id) {
        if (d.last_name != null) {
          name += d.last_name;
        }
      }
    });
    return name;
  }


  getlength(id: string) {
    if (id !== null) {
      return id.length > 0;
    } else {
      return false;
    }
  }

}
