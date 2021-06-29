export enum PilotesTypes {
  pilote,
  electricite,
  fluide,
  structure,
  vrd,
  cps
}

export class Project {
  constructor(
    public nom_PROJECT: string,
    public num_CONTRAT: string,
    public num_MARCHE: string,
    public maitre_DOUVRAGE: string,
    public localisation: string,
    public anne_DEPART: string,
    public anne_FIN: string,
    public bureau_DE_CONTROLE: string,
    public laboratoire: string,
    public architecte: string,
    public entreprise: string,
    public pilote: string,
    public electricite: string,
    public fluide: string,
    public structure: string,
    public vrd: string,
    public cps: string,
    public pilotes?: { id: string, last_name: string, type: PilotesTypes }[],
    public id?: string,
  ) {
  }
}
