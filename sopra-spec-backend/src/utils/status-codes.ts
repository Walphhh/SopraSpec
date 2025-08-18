export enum Status {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export interface StatusError {
  status: Status;
  message: string;
}

const errorMessages: { [key in Status]: string } = {
  [Status.SUCCESS]: "Success",
  [Status.BAD_REQUEST]: "Bad Request",
  [Status.UNAUTHORIZED]: "Unauthorized",
  [Status.FORBIDDEN]: "Forbidden",
  [Status.NOT_FOUND]: "Not Found",
  [Status.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};

export const getStatusMessage = (status: Status) => errorMessages[status];
