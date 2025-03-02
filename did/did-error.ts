export class DidError extends Error {
  constructor(
    public readonly did: string,
    message: string,
    public readonly code: string,
  ) {
    super(message);
  }

  override toString(): string {
    return `${this.constructor.name} ${this.code} (${this.did}): ${this.message}`;
  }
}

export class InvalidDidFormatError extends DidError {
  constructor(did: string) {
    super(did, "Invalid DID format", "did-invalid-format");
  }
}

export class InvalidDidMethodError extends DidError {
  constructor(did: string) {
    super(did, "Invalid DID method", "did-invalid-method");
  }
}

export class InvalidPlcDidLengthError extends DidError {
  constructor(did: string) {
    super(did, "Invalid PLC DID length", "did-invalid-plc-length");
  }
}
