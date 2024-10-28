import { Request } from "express";
import short from "short-uuid";
import { ProcessedRequest, ProcessedMessage, MessageEvent } from "../@types/utils.js";

export const dateFormatter = (date: Date) => {
  return date.toString().slice(0,25)
}

export const isJson = (item: string | Object) => {
  console.log("🤖 ~ isJson ~ item:", item)
  let value = typeof item !== "string" ? JSON.stringify(item) : item;

  try {
    value = JSON.parse(value);
  } catch (e) {
    return false;
  }
    
  return typeof value === "object" && value !== null;
}

export const generateId = () => {
  return short.generate()
}

export const isValidWSURL = (url: string) => {
  const MAX_PORT = 65535
  const wsRegexp = /^(ws|wss|http|https):\/\/(?:[a-zA-Z0-9-.]+)+[a-zA-Z]{2,6}(?::\d{1,5})?(?:\/[^\s]*)?$/g
  const portNumber = url.match(/:(\d+)/)
  if (portNumber) {
    return url.match(wsRegexp) && Number(portNumber[1]) <= MAX_PORT 
  }
  
  return url.match(wsRegexp)
}

export const processRequest = (request: Request): ProcessedRequest => {
  const nestId = request.params.nestId
  const origin = request.headers.origin || request.headers.host
  const originIp = request.headers['x-forwarded-for'] || request.ip
  const method = request.method
  const query = request.query
  const path = request.params[0]
  const headers = request.headers
  const body = request.body
  const arrivedOn = new Date()
  const id = generateId()
  const processedRequest: ProcessedRequest = { 
    id, 
    nestId,
    origin,
    originIp, 
    path,
    query, 
    headers, 
    method, 
    body,
    arrivedOn, 
  }
  
  return processedRequest
}

export const processWSMessage = (messageEvent: MessageEvent | Object, nestId: string, wsServerURL: string): ProcessedMessage => {
  const messageData = isJson(messageEvent) ? JSON.parse(messageEvent as string) : messageEvent
  const processedMessage: ProcessedMessage = {
    id: generateId(),
    nestId,
    serverURL: wsServerURL, 
    data: messageData,
    arrivedOn: new Date(),
  }

  return processedMessage
}