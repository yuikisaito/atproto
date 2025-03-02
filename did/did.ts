import { InvalidDidFormatError, InvalidDidMethodError, InvalidPlcDidLengthError } from "./did-error.ts";

export const DID_REGEX = /^did:(?<method>[a-z]+):(?<value>[a-zA-Z0-9._:%-]*[a-zA-Z0-9._-])$/;
export const DID_PATTERN = DID_REGEX.source.replace(/^\^|\$$/g, "");
const VALID_DID_METHODS = new Set(["web", "plc"]);

export class DID {
  readonly did: string;
  readonly method: string;

  constructor(did: string) {
    const match = DID_REGEX.exec(did);
    if (!match || !match.groups) {
      throw new InvalidDidFormatError(did);
    }

    const method = match.groups.method;
    if (!VALID_DID_METHODS.has(method)) {
      throw new InvalidDidMethodError(did);
    }

    if (method === "plc" && did.length !== 32) {
      throw new InvalidPlcDidLengthError(did);
    }

    this.did = did;
    this.method = method;
  }
}
