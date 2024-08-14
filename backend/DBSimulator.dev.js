const nests = {}

export default (mode, nestId, newNest, data, wsServerURL) => {
  try {
    if (mode === 'newNest') {
      nests[nestId] = newNest
      return nestId
    } else if (mode === 'get' && nests[nestId]){
      return nests[nestId]
    } else if (mode === 'addReq' && nests[nestId]) {
      nests[nestId].requests.push(data)
      return nestId
    } else if (mode === 'getAll') {
      return nests
    } else if (mode === 'exist') {
      return !!nests[nestId]
    } else if (mode === 'newWs') {
      if (!nests[nestId].wsConnections[wsServerURL]) {
        nests[nestId].wsConnections[wsServerURL] = []
      }
      
      return nestId
    } else if (mode === 'wsMessage') {
      nests[nestId].wsConnections[wsServerURL].push(data)
    }
  } catch (e) {
    console.error(e)
  }
}
