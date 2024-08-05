import { Router } from "express";
import short from 'short-uuid';

const apiRouter = Router()

let id = 0
export let nests = {}


apiRouter.get('/nest/:nestId', async (req, res) => {
  const nestId = req.params.nestId
  if (nests[nestId]) {
    res.status(200).send(nests[nestId])
  }
  
  res.status(404).send({
    error: `there is no nest with that id, or the id is invalid: ${nestId}`
  })
})

apiRouter.post('/createNest', async (req, res, next) => {
  try {
    const nestId = short.generate()
    nests[nestId] = {id: id++, ip: req.ip, hostName: req.hostname, requests: []}
    res.status(200).send({ nestId })
  } catch (e) {
    next(e); // Pass the error to the next middleware (error handler, etc.)
  }
})


export default apiRouter