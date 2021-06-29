import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ProjectService} from '../project.service';
import {Pilote} from '../../../models/pilote.model';
import {PiloteService} from '../../pilote/pilote.service';
import {Project} from '../../../models/project.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ajouter',
  templateUrl: './ajouter.component.html',
  styleUrls: ['./ajouter.component.css']
})
export class AjouterComponent implements OnInit {
  pilotes: { id: string, last_name: string }[] = [];
  all = '^[a-zA-Z\\.]+$|^[a-zA-Z\\.]+[ ][a-zA-Z\\.]+$|^[a-zA-Z\\.]+[ ][&][ ][a-zA-Z\\.]+$|^[a-zA-Z\\.]+[ ][a-zA-Z\\.]+[ ][&][ ][a-zA-Z\\.]+$|^[a-zA-Z\\.]+[ ][a-zA-Z\\.]+[ ][&][ ][a-zA-Z\\.]+[ ][a-zA-Z\\.]+$|^[a-zA-Z\\.]+[ ][&][ ][a-zA-Z\\.]+[ ][a-zA-Z\\.]+$';
  succes = false;
  loding = false;

  constructor(private projectService: ProjectService, public piloteService: PiloteService, private route: Router) {
  }

  async ngOnInit(): Promise<any> {
    await this.piloteService.getPilotesNames();
    if (!localStorage.getItem('user')) {
      await this.route.navigate(['/signin']);
    }
    this.pilotes = this.piloteService.pilotesNames;
  }


  async getpiloteid(fm: string) {
    if (fm != undefined) {
      await this.piloteService.getPilotesNames();
      const i = this.piloteService.pilotesNames.findIndex(p => {
        return p.last_name.trim() == fm.trim();
      });
      if (i != -1) {
        fm = this.piloteService.pilotesNames[i].id;
      }
      if (i == -1) {
        if (fm.indexOf('&') != -1) {
          let ps1 = -1;
          let ps2 = -1;
          ps1 = this.piloteService.pilotesNames.findIndex(p => {
            return p.last_name.trim() == fm.substring(0, fm.indexOf('&')).trim();
          });
          ps2 = this.piloteService.pilotesNames.findIndex(p => {
            return p.last_name.trim() == fm.substring(fm.indexOf('&') + 1, fm.length).trim();
          });
          if (ps1 == -1) {
            const p1 = new Pilote(null, null, null, null, null, null, fm.substring(0, fm.indexOf('&')).trim(), null);
            await this.piloteService.addPilote(p1).toPromise();
          }
          if (ps2 == -1) {
            const p2 = new Pilote(null, null, null, null, null, null, fm.substring(fm.indexOf('&') + 1, fm.length).trim(), null);
            await this.piloteService.addPilote(p2).toPromise();
          }
          const ps = new Pilote(null, null, null, null, null, null, fm, null);
          const p = await this.piloteService.addPilote(ps).toPromise();
          console.log(p);
          fm = p.id;
        } else {
          const p = new Pilote(null, null, null, null, null, null, fm, null);
          const data = await this.piloteService.addPilote(p).toPromise();
          fm = data.id;
        }
      }
      return fm;

    } else {
      return null;
    }
  }

  async onSubmit(form: NgForm) {
    if (form.valid) {
      let p: Project = form.value;
      p.vrd = await this.getpiloteid(form.value.vrd);
      p.pilote = await this.getpiloteid(form.value.pilote);
      p.fluide = await this.getpiloteid(form.value.fluide);
      p.structure = await this.getpiloteid(form.value.structure);
      p.electricite = await this.getpiloteid(form.value.electricite);
      p.cps = await this.getpiloteid(form.value.cps);
      this.loding = true;
      this.projectService.addProject(p).subscribe(data => {
        this.succes = data != null;
        this.loding = false;
        setTimeout(() => {
          this.succes = false;
        }, 3000);
      });
    }
  }


  getName(p: { id: string, last_name: string }) {
    let name = '';
    if (p.last_name != null) {
      name += p.last_name;
    }
    return name;
  }

}
