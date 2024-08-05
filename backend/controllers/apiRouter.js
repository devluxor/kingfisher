import e, { Router } from "express";
import short from 'short-uuid';

const apiRouter = Router()

let id = 0
export let nests = {}


apiRouter.get('/nest/:nestId', async (req, res) => {
  const nestId = req.params.nestId
  const nest = nestDBSimulator('get', nestId)
  // if (nests[nestId]) {
  if (nest) {
    return res.status(200).send(nest)
  }
  console.log(nests)
  res.status(404).send({
    error: `there is no nest with that id, or the id is invalid: ${nestId}`
  })
})

apiRouter.post('/createNest', async (req, res, next) => {
  try {
    const nestId = short.generate()
    const newNest = {id: id++, ip: req.ip, hostName: req.hostname, requests: []}
    nestDBSimulator('newNest', nestId, newNest  )
    // nests[nestId] = {id: id++, ip: req.ip, hostName: req.hostname, requests: []}
    res.status(200).send({ nestId })
  } catch (e) {
    next(e); // Pass the error to the next middleware (error handler, etc.)
  }
})

export const nestDBSimulator = (mode, nestId, newNest, req) => {
  if (mode === 'newNest') {
    nests[nestId] = newNest
    return nestId
  } else if (mode === 'get' && nests[nestId]){
    return nests[nestId]
  } else if (mode === 'addReq' && nests[nestId]) {
    nests[nestId].requests.push(req)
    return nestId
  }
}


export default apiRouter