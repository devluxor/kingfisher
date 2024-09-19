import short from "short-uuid";

export const dateFormatter = (date) => {
  return date.toString().slice(0,25)
}

export const isJson = (item) => {
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

export const isValidWSURL = (url) => {
  const MAX_PORT = 65535
  const wsRegexp = /^(ws|wss|http|https):\/\/(?:[a-zA-Z0-9-.]+)+[a-zA-Z]{2,6}(?::\d{1,5})?(?:\/[^\s]*)?$/g
  const portNumber = url.match(/:(\d+)/)
  if (portNumber) {
    return url.match(wsRegexp) && Number(portNumber[1]) <= MAX_PORT 
  }
  
  return url.match(wsRegexp)
}

export const processRequest = (request) => {
  const nestId = request.params.nestId
  const origin = request.headers.origin
  const originIp = request.headers['x-forwarded-for']
  const method = request.method
  const query = request.query
  const path = request.params[0]
  const headers = request.headers
  const body = request.body
  const arrivedOn = new Date()
  const id = generateId()
  const processedRequest = { 
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

  console.log(processedRequest)
  return processedRequest
}

export const processWSMessage = (messageEvent, nestId, wsServerURL) => {
  const messageData = isJson(messageEvent) ? JSON.parse(messageEvent) : messageEvent
  const processedMessage = {
    id: generateId(),
    nestId,
    serverURL: wsServerURL, 
    data: messageData,
    arrivedOn: new Date(),
  }
  return processedMessage
}