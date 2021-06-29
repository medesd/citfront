import {Component, OnInit} from '@angular/core';
import {PiloteService} from '../pilote.service';
import {Pilote} from '../../../models/pilote.model';

@Component({
  selector: 'app-pilotes',
  templateUrl: './pilotes.component.html',
  styleUrls: ['./pilotes.component.css']
})
export class PilotesComponent implements OnInit {
  pilotes: Pilote[];
  loding = false;


  constructor(private piloteService: PiloteService) {
  }

  async ngOnInit() {
    this.loding = true;
    this.pilotes = await this.piloteService.getAllPilotes().toPromise();
    for (const p of this.pilotes) {
      if (isNaN(p.len_en)) {
        p.len_en = 0;
      }
      let data = await this.piloteService.getPiloteProjects(p.id).toPromise();
      data = data.filter(d => {
        return d.anne_FIN == '-' || !d.anne_FIN || d.anne_FIN > new Date(Date.now()).getFullYear().toString();
      });

      if (p.nom.indexOf('&') != -1) {
        await this.piloteService.getPilotesNames();
        let i = this.piloteService.pilotesNames.findIndex(u => u.last_name.trim() == p.nom.substring(p.nom.indexOf('&') + 1).trim());
        let j = this.piloteService.pilotesNames.findIndex(u => u.last_name.trim() == p.nom.substring(0, p.nom.indexOf('&')).trim());

        let p1, p2;
        let cpt = 0;
        if (i != -1) {
          p1 = this.pilotes.find(k => {
            return p.nom.substring(p.nom.indexOf('&') + 1).trim() == k.nom.trim();
          }).id;
        } else {
          cpt++;
        }
        if (j != -1) {
          p2 = this.pilotes.find(k => {
            return p.nom.substring(0, p.nom.indexOf('&')).trim() == k.nom.trim();
          }).id;
        } else {
          cpt++;
        }

        if (cpt == 2) {
          await this.piloteService.removePilote(p.id).toPromise();
        }

        this.pilotes.forEach(fk => {
          if (i != -1) {
            if (fk.id == p1) {
              if (fk.len_en == undefined) {
                fk.len_en = 0;
              }

              fk.len_en += data.filter(d => {
                let tfk = 1;
                if (d.structure == p1) {
                  tfk += 1;
                }
                if (d.vrd == p1) {
                  tfk += 1;
                }
                if (d.cps == p1) {
                  tfk += 1;
                }
                if (d.fluide == p1) {
                  tfk += 1;
                }
                if (d.electricite == p1) {
                  tfk += 1;
                }
                if (tfk == 1) {
                  return d;
                }
              }).length;


            }
          }
          if (j != -1) {
            if (fk.id == p2) {

              if (fk.len_en == undefined) {
                fk.len_en = 0;
              }
              fk.len_en += data.filter(d => {
                let tfk = 1;
                if (d.structure == p2) {
                  tfk += 1;
                }
                if (d.vrd == p2) {
                  tfk += 1;
                }
                if (d.cps == p2) {
                  tfk += 1;
                }
                if (d.fluide == p2) {
                  tfk += 1;
                }
                if (d.electricite == p2) {
                  tfk += 1;
                }
                if (tfk == 1) {
                  return d;
                }
              }).length;
            }
          }
        });
      } else {
        p.len_en += data.length;
      }
    }
    this.pilotes = this.pilotes.filter(d => {

      return d.nom.indexOf('&') === -1;
    });
    this.loding = false;
  }

  addtolsit(pilote: Pilote) {
    pilote.len_en = 0;
    this.pilotes.push(pilote);
  }

  checkAdmin(): boolean {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user')).roles.indexOf('ROLE_ADMIN') !== -1;
    } else {
      return null;
    }
  }
}
