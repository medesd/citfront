import {Component, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {Project} from '../../../models/project.model';
import {ProjectService} from '../project.service';
import {Pilote} from '../../../models/pilote.model';
import {PiloteService} from '../../pilote/pilote.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ajouter-xlsx',
  templateUrl: './ajouter-xlsx.component.html',
  styleUrls: ['./ajouter-xlsx.component.css']
})
export class AjouterXlsxComponent implements OnInit {

  allinserted: boolean = false;
  inseted: boolean[] = [];
  show = false;
  projects: Project[] = [];
  fromjson;
  cpt: number = 0;
  loding = false;

  constructor(private projectService: ProjectService, private piloteService: PiloteService, private route: Router) {
  }

  onFileChange(ev) {
    if (ev.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

      let workBook = null;
      let jsonData = null;
      const reader = new FileReader();
      const file = ev.target.files[0];
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, {type: 'binary'});
        jsonData = workBook.SheetNames.reduce((initial, name, i) => {
          this.cpt++;
          const sheet = workBook.Sheets[name];
          initial[i] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        this.fromjson = jsonData[0];
        this.cpt = jsonData[0].length;
        this.setdown();
      };
      reader.readAsBinaryString(file);
    }
  }

  setdown() {
    for (let i = 0; i < this.cpt; i++) {
      let nom_PROJECT: string = this.fromjson[i]['PROJET'];
      let num_CONTRAT: string = this.fromjson[i]['N°CONTRAT'];
      let num_MARCHE: string = this.fromjson[i]['N° MARCHE'];
      let maitre_DOUVRAGE: string = this.fromjson[i]['MAITRE D\'OUVRAGE'];
      let localisation: string = this.fromjson[i]['LOCALISATION'];
      let anne_DEPART: string = this.fromjson[i]['ANNEE DEPART'];
      let anne_FIN: string = this.fromjson[i]['ANNEE FIN'];
      let bureau_DE_CONTROLE: string = this.fromjson[i]['BUREAU DE CONTRÔLE'];
      let laboratoire: string = this.fromjson[i]['LABORATOIRE'];
      let architecte: string = this.fromjson[i]['ARCHITECTE'];
      let entreprise: string = this.fromjson[i]['ENTREPRISE'];
      let pilote: string = this.fromjson[i]['PILOTE'];
      let electricite: string = this.fromjson[i]['ELECTRICITE'];
      let fluide: string = this.fromjson[i]['FLUIDE'];
      let structure: string = this.fromjson[i]['STRUCTURE'];
      let vrd: string = this.fromjson[i]['VRD'];
      let cps: string = this.fromjson[i]['CPS'];
      let prg: Project = new Project(nom_PROJECT, num_CONTRAT, num_MARCHE, maitre_DOUVRAGE, localisation, anne_DEPART, anne_FIN, bureau_DE_CONTROLE, laboratoire, architecte, entreprise, pilote, electricite, fluide, structure, vrd, cps);
      this.projects.push(prg);
      this.inseted[i] = false;
    }
    this.show = true;
  }

  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.route.navigate(['/signin']).then(null);
    }
  }

  getPilotename(p: string) {

    return new Pilote(null, null, null, null, null, null, p.trim(), null, null);

  }

  async makeifexists(p: string) {
    await this.piloteService.getPilotesNames();
    if (p != undefined) {
      let check = true;
      this.piloteService.pilotesNames.forEach(d => {
        if (p.trim() == d.last_name.trim()) {
          p = d.id;
          check = false;
        }
      });
      if (check) {
        if (p.indexOf('&') != -1) {
          let checkone = true;
          let checktwo = true;
          this.piloteService.pilotesNames.forEach(ps => {
            if (ps.last_name.trim() == p.substring(0, p.indexOf('&')).trim()) {
              checkone = false;
            }

            if (ps.last_name.trim() == p.substring(p.indexOf('&') + 1, p.length).trim()) {
              checktwo = false;
            }
          });
          if (checktwo) {
            await this.piloteService.addPilote(this.getPilotename(p.substring(p.indexOf('&') + 1, p.length).trim())).toPromise();
          }
          if (checkone) {
            await this.piloteService.addPilote(this.getPilotename(p.substring(0, p.indexOf('&')).trim())).toPromise();
          }


          const data = await this.piloteService.addPilote(this.getPilotename(p.trim())).toPromise();
          p = data.id;
        } else {
          const data = await this.piloteService.addPilote(this.getPilotename(p.trim())).toPromise();
          p = data.id;
        }

      }
    }
    return p;
  }

  async insertAll() {
    this.loding = true;
    for (let p of this.projects) {
      if (p.pilote != undefined) {
        p.pilote = await this.makeifexists(p.pilote);
      }
      if (p.vrd != undefined) {
        p.vrd = await this.makeifexists(p.vrd);
      }
      if (p.structure != undefined) {
        p.structure = await this.makeifexists(p.structure);
      }
      if (p.fluide != undefined) {
        p.fluide = await this.makeifexists(p.fluide);
      }
      if (p.electricite != undefined) {
        p.electricite = await this.makeifexists(p.electricite);
      }
      if (p.cps != undefined) {
        p.cps = await this.makeifexists(p.cps);
      }
      this.projectService.addProject(p).subscribe(() => {
        this.loding = false;
        this.allinserted = true;
      });
    }

  }

}
