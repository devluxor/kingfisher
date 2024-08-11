import { testRequest } from "../services/testApi";

export const test = async (nestId) => {
  try {
    await testRequest(nestId)
  } catch (error) {
    console.error(error)
  }
}

export const copyNestId = async (currentNestId) => {
  try {
    await navigator.clipboard.writeText(currentNestId)
    console.log('Text copied to clipboard');
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
  const historyCache = JSON.parse(localStorage.getItem('kingfisherHistoryCache'))
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
  const HistoryCache = JSON.parse(localStorage.getItem('kingfisherHistoryCache'))
  return nestId in HistoryCache 
}

export const isValidNestId = (nestId) => {
  const UUID_CHARS = 22
  const UUID_REGEX = new RegExp(`^[A-Za-z0-9]{${UUID_CHARS}}$`, 'g')

  return nestId && nestId.match(UUID_REGEX)
}