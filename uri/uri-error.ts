export class UriError extends Error {
  constructor(
    public readonly uri: string,
    message: string,
    public readonly code: string,
  ) {
    super(message);
  }

  override toString(): string {
    return `${this.constructor.name} ${this.code} (${this.uri}): ${this.message}`;
  }
}

export class InvalidUriFormatError extends UriError {
  constructor(uri: string) {
    super(uri, "Invalid URI format", "uri-invalid-format");
  }
}

export class InvalidHostFormatError extends UriError {
  constructor(host: string) {
    super(host, "Invalid host format", "uri-invalid-host-format");
  }
}

export class InvalidCollectionFormatError extends UriError {
  constructor(collection: string) {
    super(collection, "Invalid collection format", "uri-invalid-collection-format");
  }
}

export class InvalidRkeyFormatError extends UriError {
  constructor(rkey: string) {
    super(rkey, "Invalid rkey format", "uri-invalid-rkey-format");
  }
}

export class InvalidQueryFormatError extends UriError {
  constructor(query: string) {
    super(query, "Invalid query format", "uri-invalid-query-format");
  }
}
