import {
  InvalidCollectionFormatError,
  InvalidHostFormatError,
  InvalidQueryFormatError,
  InvalidRkeyFormatError,
  InvalidUriFormatError,
} from "./uri-error.ts";
import { DID_PATTERN } from "@yuikisaito/atproto-did";

function stripAnchors(regex: RegExp): string {
  return regex.source.replace(/^\^|\$$/g, "");
}

export const HANDLE_REGEX = /^[a-z0-9][a-z0-9.:-]*$/;
export const HANDLE_PATTERN = stripAnchors(HANDLE_REGEX);

export const ATP_URI_HOST_REGEX = new RegExp(
  `^(?:(?<did>${DID_PATTERN})|(?<handle>${HANDLE_REGEX}))$`,
);
export const ATP_URI_HOST_PATTERN = stripAnchors(ATP_URI_HOST_REGEX);

export const COLLECTION_REGEX = /^[^?#\s]*$/;
export const COLLECTION_PATTERN = stripAnchors(COLLECTION_REGEX);

export const RKEY_REGEX = /^[^?#\s]*$/;
export const RKEY_PATTERN = stripAnchors(RKEY_REGEX);

export const ATP_URI_QUERY_REGEX = /^[^#\s]+$/;
export const ATP_URI_QUERY_PATTERN = stripAnchors(ATP_URI_QUERY_REGEX);

export const ATP_URI_HASH_REGEX = /^[^\s]+$/;
export const ATP_URI_HASH_PATTERN = stripAnchors(ATP_URI_HASH_REGEX);

export const ATP_URI_REGEX = new RegExp(
  `^(?<protocol>at:\\/\\/)?(?<name>${ATP_URI_HOST_PATTERN})(?<path>\\/(?<collection>${COLLECTION_PATTERN})(?:\\/(?<rkey>${RKEY_PATTERN}))?)?(\\?(?<query>${ATP_URI_QUERY_PATTERN}))?(#(?<hash>${ATP_URI_HASH_PATTERN}))?$`,
);
export const ATP_URI_PATTERN = stripAnchors(ATP_URI_REGEX);

export class AtURI {
  readonly protocol = "at:";

  private _did = "";
  private _handle = "";
  private _collection = "";
  private _rkey = "";
  private _query = "";
  private _hash = "";

  constructor(uri: string) {
    const match = ATP_URI_REGEX.exec(uri);
    if (!match?.groups) {
      throw new InvalidUriFormatError(uri);
    }

    const {
      did = "",
      handle = "",
      collection = "",
      rkey = "",
      query = "",
      hash = "",
    } = match.groups;

    this._did = did;
    this._handle = handle;
    this._collection = collection;
    this._rkey = rkey;
    this._query = query;
    this._hash = hash;
  }

  get origin(): string {
    return `${this.protocol}//${this.host}`;
  }

  get host(): string {
    return this._did || this._handle;
  }

  set host(value: string) {
    const match = ATP_URI_HOST_REGEX.exec(value);
    if (!match?.groups) {
      throw new InvalidHostFormatError(value);
    }
    const { did = "", handle = "" } = match.groups;
    this._did = did;
    this._handle = handle;
  }

  get hostname(): string {
    return this.host;
  }
  set hostname(value: string) {
    this.host = value;
  }

  get collection(): string {
    return this._collection;
  }
  set collection(value: string) {
    if (!COLLECTION_REGEX.test(value)) {
      throw new InvalidCollectionFormatError(value);
    }
    this._collection = value;
  }

  get rkey(): string {
    return this._rkey;
  }
  set rkey(value: string) {
    if (!RKEY_REGEX.test(value)) {
      throw new InvalidRkeyFormatError(value);
    }
    this._rkey = value;
  }

  get pathname(): string {
    if (!this.collection) return "";
    return `/${this.collection}${this.rkey ? `/${this.rkey}` : ""}`;
  }

  get search(): string {
    const query = this.searchParams.toString();
    return query ? `?${query}` : "";
  }
  set search(value: string) {
    if (!ATP_URI_QUERY_REGEX.test(value)) {
      throw new InvalidQueryFormatError(value);
    }
    this._query = value;
  }

  get searchParams(): URLSearchParams {
    return new URLSearchParams(this._query);
  }

  get href(): string {
    const hashPart = this._hash ? `#${this._hash}` : "";
    return `${this.origin}${this.pathname}${this.search}${hashPart}`;
  }

  toString(): string {
    return this.href;
  }
}
