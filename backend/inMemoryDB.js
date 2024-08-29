const nests = {}

const loadNest = (nestId) => {
  nests[nestId] = { wsConnections: {} }
  return nestId
}

const addNewWSConnection = (nestId, wsServerURL) => {
  console.log('add new ws connection')
  console.log(nests)
  try {
    if (!nests[nestId]?.wsConnections[wsServerURL]) {
      nests[nestId].wsConnections[wsServerURL] = []
    }
  } catch (e) {
    console.error(e)
  }
  
  return nestId
}

const addNewWSMessage = (nestId, wsServerURL, data) => {
  console.log('add new ws message')
  nests[nestId].wsConnections[wsServerURL].push(data)
}

export default {
  loadNest,
  addNewWSConnection,
  addNewWSMessage
}