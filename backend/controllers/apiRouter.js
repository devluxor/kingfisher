import { Router } from "express";
import short from 'short-uuid';
import DBSimulator from "./DBSimulator.dev.js";

const apiRouter = Router()

// to delete later? 
apiRouter.get('/nests/all', async (req, res) => {
  const nestId = req.params.nestId
  const nests = DBSimulator('getAll', nestId)
  res.status(200).send(nests)
})

apiRouter.get('/nests/:nestId/', async (req, res) => {
  const nestId = req.params.nestId
  const nest = DBSimulator('get', nestId)

  if (nest) {
    return res.status(200).send(nest)
  }

  res.status(404).send({
    error: `There is no nest with that id, or the id is invalid: ${nestId}`
  })
})

apiRouter.post('/createNest', async (req, res, next) => {
  try {
    const nestId = short.generate()
    const newNest = {id: nestId, ip: req.ip, hostName: req.hostname, requests: []}
    DBSimulator('newNest', nestId, newNest  )
    res.status(200).send({ nestId })
  } catch (e) {
    next(e); // Pass the error to the next middleware (error handler, etc.)
  }
})

export default apiRouter