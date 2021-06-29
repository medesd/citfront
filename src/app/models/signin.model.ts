export enum Roles {
  ADMIN="ADMIN",
  USER="USER"
}

export class Signin {
  constructor(public id:string ,public username:string,public roles:Roles[] ,public accessToken:string,public tokenType:string) {
  }
}
