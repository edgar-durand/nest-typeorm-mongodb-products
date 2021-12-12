export interface IResponse {
  result: boolean;
  message?: string | null;
  data?: any;
  errors?: string[] | null;
}
export interface JWTPayload {
  userId: string;
  roles?: string[];
  exp?: number;
  iat?: number;
  token?: string;
}
