export default class AppError extends Error {
  statusCode?: number;
  status?: string;
  message: string;
  isOperational = true;
  attributes: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    attributes?: Record<string, any>
  ) {
    super(message); // call the parent constructor
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // this is for the dev to know if the error is operational or not
    this.attributes = attributes;
    Error.captureStackTrace(this, this.constructor);
  }
}
