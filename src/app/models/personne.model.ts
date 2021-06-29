export interface Personne {
  id?: number;
  name: string;
  absence?: Absence[];
  conges: number;
  groupe?: Groupe;
  conge: boolean;
}

export interface Absence {
  id?: number;
  entryDate: Date;
  type: number;
}

export interface Groupe {
  id?: number;
  type: number;
  name: string;
}
