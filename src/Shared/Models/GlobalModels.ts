export interface ResponseModel<T> {
  status: 'success' | 'error' | 'incomplete',
  data: T,
  message: string,
}

export interface JwtPayload {
  sub: string;
  exp: number;
  role: string;
}