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
  const wsRegexp = /^(ws|wss|http|https):\/\/(?:[a-zA-Z0-9-.]+)+[a-zA-Z]{2,6}(?::\d{1,5})?(?:\/[^\s]*)?$/g
  return url.match(wsRegexp)
}

export const processRequest = (request) => {
  const nestId = request.params.nestId
  const method = request.method
  const path = request.params[0]
  const headers = request.headers
  const body = request.body
  const arrivedOn = new Date()
  const id = generateId()

  const processedRequest = { 
    id, 
    nestId, 
    path, 
    headers, 
    method, 
    body,
    arrivedOn, 
  }

  return processedRequest
}
