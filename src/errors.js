export class SuprsendError extends Error {
  constructor(message) {
    super(message);
    this.name = "SuprsendError";
  }
}

export class SSConfigurationError extends SuprsendError {
  constructor(message) {
    super(message);
    this.name = "SuprsendConfigurationError";
  }
}

export class SSValidationError extends SuprsendError {
  constructor(message) {
    super(message);
    this.name = "SuprsendValidationError";
  }
}
