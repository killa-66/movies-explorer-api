const AUTH_ERROR = 401;

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTH_ERROR;
  }
}

module.exports = AuthorizationError;
