export default class ApiError extends Error {
  public status;
  public errors;

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.errors = errors;
    this.status = status;
  }

  static BadRequestError(message: string, errors: any[] = []) {
    return new ApiError(400, message, errors);
  }

  static UnauthorizedError(message?: string, errors: any[] = []) {
    return new ApiError(401, message || 'Error: not authorized!', errors);
  }

  static InternalServerError(message: string, errors: any[] = []) {
    return new ApiError(500, message, errors);
  }

  static NotImplementedError(message: string) {
    return new ApiError(501, message);
  }
}
