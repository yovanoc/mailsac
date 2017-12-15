export interface IMailsacError {
  details: string;
  message: string;
  status: ErrorCodes;
}

export enum ErrorCodes {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TEAPOT = 418,
  RELAX = 420,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}
