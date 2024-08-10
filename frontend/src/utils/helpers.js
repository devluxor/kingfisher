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

export const setupHistoryCache = (currentNestId) => {
  if (!localStorage.getItem('kingfisherHistoryCache') || localStorage.getItem('kingfisher')?.length === 0) {
    const store = {}
    if (currentNestId) store[currentNestId] = true

    localStorage.setItem('kingfisherHistoryCache', JSON.stringify(store))
  }
}

export const saveNestInLocalStorage = (nestId) => {
  localStorage.setItem('kingfisherNest', nestId)
}

export const saveNestInHistoryCache = (nestId) => {
  const MAX_BYTE_SIZE = 4_999_900
  const HistoryCache = JSON.parse(localStorage.getItem('kingfisherHistoryCache'))
  const HistoryCacheSize = new Blob([HistoryCache]).size
  if (HistoryCacheSize >= MAX_BYTE_SIZE) {
    alert(`
      Warning! The HistoryCache exceeds the maximum size allowed of 5 Mb, 
      new entries will replace the older ones until the storage is manually cleared.
    `)
    const firstKey = Object.keys(HistoryCache)
    delete HistoryCache[firstKey]
  }

  HistoryCache[nestId] = true
  localStorage.setItem('kingfisherHistoryCache', JSON.stringify(HistoryCache))
}

export const isNestInHistoryCache = (nestId) => {
  const HistoryCache = JSON.parse(localStorage.getItem('kingfisherHistoryCache'))
  return nestId in HistoryCache 
}