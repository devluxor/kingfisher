const nests = {}

export default (mode, nestId, newNest, req) => {
  try {
    if (mode === 'newNest') {
      nests[nestId] = newNest
      return nestId
    } else if (mode === 'get' && nests[nestId]){
      return nests[nestId]
    } else if (mode === 'addReq' && nests[nestId]) {
      nests[nestId].requests.push(req)
      return nestId
    } else if (mode === 'getAll') {
      return nests
    }
  } catch (e) {
    console.error(e)
  }

}
