export interface Jours {
  items: Item[];
}

export interface Item {
  summary: string;
  start: Start;
  id: string;
}

export interface Start {
  date: string;
}
