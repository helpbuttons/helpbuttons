//User interface
export interface IUser {

  username: string,
  email: string,
  realm: string,
  roles: [],
  token: string,

}

export interface ICurrentUser {

  token: string,

}
