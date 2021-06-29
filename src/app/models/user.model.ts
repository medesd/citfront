export class Users {
  constructor(public username: string, public password?: string, public roles?: { id: number, name: string }[], public id?: string,) {
  }
}

export class ids {
  constructor(public id: number) {
  }
}
