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

export const setupHistory = () => {
  if (!localStorage.getItem('kingfisherHistory')) {
    localStorage.setItem('kingfisherHistory', JSON.stringify({}))
  }
}

export const saveNestInLocalStorage = (nestId) => {
  localStorage.setItem('kingfisherNest', nestId)
}

export const saveNestInHistory = (nestId) => {
  const MAX_BYTE_SIZE = 4_999_900
  const history = JSON.parse(localStorage.getItem('kingfisherHistory'))
  const historySize = new Blob([history]).size
  if (historySize >= MAX_BYTE_SIZE) {
    alert(`
      Warning! The history exceeds the maximum size allowed of 5 Mb, 
      new entries will replace the older ones until the storage is manually cleared.
    `)
    const firstKey = Object.keys(history)
    delete history[firstKey]
  }

  history[nestId] = true
  localStorage.setItem('kingfisherHistory', JSON.stringify(history))
}