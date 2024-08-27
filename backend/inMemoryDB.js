const nests = {}

const loadNest = (nestId) => {
  nests[nestId] = { wsConnections: {} }
  return nestId
}

const addNewWSConnection = (nestId, wsServerURL) => {
  if (!nests[nestId].wsConnections[wsServerURL]) {
    nests[nestId].wsConnections[wsServerURL] = []
  }
  
  return nestId
}

const addNewWSMessage = (nestId, wsServerURL, data) => {
  nests[nestId].wsConnections[wsServerURL].push(data)
}

export default {
  loadNest,
  addNewWSConnection,
  addNewWSMessage
}