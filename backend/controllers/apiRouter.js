import { Router } from "express";
import short from 'short-uuid';
import inMemoryDB from "../services/inMemoryDB.js";
import { initializeCustomWSConnectionClient } from "../services/externalWSConnection.js";
import { getNest, getWSMessages, storeNest } from '../services/db-service.js'

const apiRouter = Router()

apiRouter.get('/nests/:nestId', async (req, res, next) => {
  try {
    const nestId = req.params.nestId
    const result = await getNest(nestId)
    inMemoryDB.loadNest(nestId)
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
    const nestId = short.generate()
    const newNest = {
      id: nestId, 
      createdOn: new Date(), 
      ip: req.ip, 
      host: req.hostname, 
      requests: [],
      wsConnections: {},
    }
    await storeNest(nestId, req.ip, req.hostname)
    inMemoryDB.loadNest(nestId)
    res.status(201).send(newNest)
  } catch (e) {
    next(e);
  }
})

const wsConnections = {}

apiRouter.post('/createWsConnection', async (req, res, next) => {
  try {
    const nestId = req.body.nestId
    const wsServerURL = req.body.wsServerURL
    const ws = initializeCustomWSConnectionClient(wsServerURL, nestId)
    wsConnections[nestId] = ws
    inMemoryDB.addNewWSConnection(nestId, wsServerURL)
    res.status(201).send({nestId})
  } catch (e) {
    next(e);
  }
})

apiRouter.post('/closeWsConnection/:nestId', async (req, res, next) => {
  try {
    const connection =  wsConnections[req.params.nestId]
    if (connection) {
      connection.close()
    }
    
    res.status(200).send()
  } catch (e) {
    next(e);
  }
})

export default apiRouter