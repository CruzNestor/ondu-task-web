export interface Credentials {
  userName: string,
  password: string,
}

export interface AuthApiModel {
  token: string;
  userName: string;
  role: string;
}