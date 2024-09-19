import { Router } from "express";
import { initializeCustomWSConnectionClient } from "../services/externalWSConnection.js";
import { getNest, getWSMessages, storeNest } from '../services/db-service.js'
import { generateId } from "../utils/others.js";
import { WebSocket } from "ws";

const apiRouter = Router()

apiRouter.get('/nests/:nestId', async (req, res, next) => {
  try {
    const nestId = req.params.nestId
    const result = await getNest(nestId)
    res.status(200).send(result)
  } catch (e) {
    next(e);
  }
})

apiRouter.get('/wsm/:nestId', async (req, res, next) => {
  try {
    const nestId = req.params.nestId
    const result = await getWSMessages(nestId, req.headers['x-kingfisher-wsserverurl'])
    res.status(200).send(result)
  } catch (e) {
    next(e);
  }
})

apiRouter.post('/createNest', async (req, res, next) => {

  try {
    const nestId = generateId()
    const newNest = {
      id: nestId, 
      createdOn: new Date(), 
      ip: req.headers['x-forwarded-for'] || req.ip, 
      host: req.hostname,
    }
    await storeNest(nestId, req.ip, req.hostname)
    res.status(201).send(newNest)
  } catch (e) {
    next(e);
  }
})

// custom ws connections for external ws server - kingfisher backend client
// (there can only be one custom connection per nest)
const wsConnections = {}

apiRouter.post('/createWsConnection', async (req, res, next) => {
  try {
    const nestId = req.body.nestId
    const wsServerURL = req.body.wsServerURL
    const ws = initializeCustomWSConnectionClient(wsServerURL, nestId)
    wsConnections[nestId] = ws
    res.status(201).send({nestId})
  } catch (e) {
    next(e);
  }
})

apiRouter.post('/closeWsConnection/:nestId', async (req, res, next) => {
  try {
    const connection =  wsConnections[req.params.nestId]
    if (connection && connection?.readyState === WebSocket.OPEN) {
      connection.close()
    }
    
    res.status(200).send()
  } catch (e) {
    next(e);
  }
})

export default apiRouter