import { IncomingHttpHeaders } from 'http';
import { ParsedQs } from 'qs';
import short from "short-uuid";

export interface ProcessedRequest {
  id: short.SUUID, 
  nestId: string,
  origin: string | string[] | undefined,
  originIp: string | string[] | undefined, 
  path: string,
  query: ParsedQs, 
  headers: IncomingHttpHeaders, 
  method: string, 
  body: string,
  arrivedOn: Date,
}

export interface ProcessedMessage {
  id: short.SUUID,
  nestId: string,
  serverURL: string, 
  data: string | object,
  arrivedOn: Date,
}

export type MessageEvent = string | { [key: string]: string}

export type Loggable = Array<string | object> | string | object | unknown
