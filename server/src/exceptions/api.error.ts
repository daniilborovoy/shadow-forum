export default class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.errors = errors;
    this.status = status;
  }

  static UnauthorizedError(message?: string, errors: any[] = []) {
    return new ApiError(401, message || 'Пользователь не авторизован!');
  }

  static ServerError(message: string, errors: any[] = []) {
    return new ApiError(500, `Ошибка сервера: ${message}`);
  }

  static BadRequest(message: string, errors: any[] = []) {
    return new ApiError(400, message, errors);
  }
}
