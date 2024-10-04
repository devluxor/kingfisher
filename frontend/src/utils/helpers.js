import dateFormat from "dateformat";
import { generate } from "random-words";
import config from "../config";

export const normalizeNest = (sqlNest) => {
  return {
    id: sqlNest[0].nest_id,
    ip: sqlNest[0].nest_ip,
    host: sqlNest[0].nest_host_name,
    createdOn: sqlNest[0].nest_created_on,
    requests: sqlNest[0].id ? sqlNest : [],
  }
}

export const copyNestURL = async (currentNestId) => {
  const baseURL = import.meta.env.DEV ? 
                    config.DEV_SERVER_URL: 
                    config.NEST_SERVER_URL

  try {
    await navigator.clipboard.writeText(`${baseURL}/!/${currentNestId}`)
  } catch (error) {
    console.error('Failed to copy text: ', error);
  }
}

export const setupHistoryCache = () => {
  const localStore = localStorage.kingfisherHistoryCache

  if (!localStore) {
    const store = {}
    localStorage.setItem('kingfisherHistoryCache', JSON.stringify(store))
  }
}

export const saveNestInLocalStorage = (nestId) => {
  localStorage.setItem('kingfisherNest', nestId)
}

export const saveNestInHistoryCache = (nestId) => {
  const MAX_BYTE_SIZE = 4_999_900
  const historyCache = JSON.parse(localStorage.getItem('kingfisherHistoryCache') || "{}")
  const historyCacheSize = new Blob([historyCache]).size
  if (historyCacheSize >= MAX_BYTE_SIZE) {
    alert(`
      Warning! The historyCache exceeds the maximum size allowed of 5 Mb, 
      new entries will replace the older ones until the storage is manually cleared.
    `)
    const firstKey = Object.keys(historyCache)
    delete historyCache[firstKey]
  }

  historyCache[nestId] = true
  localStorage.setItem('kingfisherHistoryCache', JSON.stringify(historyCache))
}

export const isNestInHistoryCache = (nestId) => {
  const historyCache = JSON.parse(localStorage.getItem('kingfisherhistoryCache'))
  return nestId in historyCache 
}

export const isValidNestId = (nestId) => {
  const UUID_CHARS = 22
  const UUID_REGEX = new RegExp(`^[A-Za-z0-9]{${UUID_CHARS}}$`, 'g')

  return nestId && nestId.match(UUID_REGEX)
}

export const isValidWSURL = (url) => {
  const wsRegexp = /^(ws|wss|http|https):\/\/(?:[a-zA-Z0-9-.]+)+[a-zA-Z]{2,6}(?::\d{1,5})?(?:\/[^\s]*)?$/g
  return url.match(wsRegexp)
}

export const isJSON = (item) => {
  let value

  try {
    value = JSON.parse(item);
  } catch (e) {
    return false;
  }
    
  return typeof value === "object" && value !== null;
}

export const isRequest = (item) => {
  return item.method && item.headers
}

export const sortDescending = (elements) => {
  return elements.sort((a, b) => {
    const dateProperty = a.arrivedOn ? 'arrivedOn' : 'arrived_on'

    return Date.parse(b[dateProperty]) - Date.parse(a[dateProperty])
  })
}

export const parseRequestData = (activeRequest, data) => {
  const parsedData = isJSON(activeRequest[data]) ? 
    JSON.parse(activeRequest[data]) :
    activeRequest[data]

  return parsedData
}

export const parseMessageData = (message) => {
  const parsedData = isJSON(message.data) ?
    JSON.parse(message.data) :
    message.data

  return parsedData
}

export const formatDate = (dateString) => {
  return dateFormat(new Date(dateString).toLocaleString())
}

export const randomHTTPMethod = () => {
  const methods = ['GET', 'POST', 'PUT', 'HEAD', 'PATCH', 'DELETE']

  return methods[Math.floor(Math.random() * methods.length)];
}

export const randomURLPatch = () => {
  const randomWords = generate(2)
  return `${randomWords[0]}/${randomWords[1]}`
}

export const lastNests = () => {
  const NUMBER_OF_NESTS = 6
  const nests = JSON.parse(localStorage.kingfisherHistoryCache)
  const nestsIds = Object.keys(nests)

  return nestsIds.length > NUMBER_OF_NESTS ? 
    nestsIds.slice(-NUMBER_OF_NESTS).reverse() : 
    nestsIds.reverse()
}