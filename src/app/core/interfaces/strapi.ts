export interface StrapiUser {
  id: number;
  username: string;
  email: string;
}

export interface StrapiData<T>{
  id:number,
  attributes:T
}

export interface StrapiArrayResponse<T> {
  data: StrapiData<T>[],
  meta: {
    pagination?: {
      page: number,
      pageSize: number,
      pageCount: number,
      total: number,
    }
  }
}

export interface StrapiExtendedUser{
  id?:number,
  name:string,
  surname:string,
  users:number,
  nickname?:string,
  picture?:string
}


export interface StrapiLoginPayload {
  identifier: string;
  password: string;
}

export interface StrapiRegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface StrapiLoginResponse {
  jwt: string;
  user: StrapiUser;
}

export interface StrapiRegisterResponse {
  jwt: string;
  user: StrapiUser;
}

export interface StrapiExtendedUser {
  id?:number,
  name:string,
  surname:string,
  users:number,
  nickname?:string,
}

interface UserData {
  users: number;
  attributes: {
    name: string;
    surname: string;
  };
}

export interface ApiResponse {
  data: UserData[];
}