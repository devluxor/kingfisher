import { testRequest } from "../services/testApi";

export const deleteRequestsFromList = () => {
  const list = document.getElementById("received-requests");
  while (list?.firstChild) {
    list.removeChild(list.lastChild);
  }
}

export const deleteMessagesFromList = () => {
  const list = document.getElementById("received-messages");
  while (list?.firstChild) {
    list.removeChild(list.lastChild);
  }
}

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