import { Router } from "express";
import short from 'short-uuid';
import inMemoryDB from "../inMemoryDB.js";
import { initializeCustomWSClient } from "../externalWSConnection.js";
import { getNest, getWSMessages, storeNest } from '../services/db-service.js'

const apiRouter = Router()

apiRouter.get('/nests/:nestId', async (req, res) => {
  const nestId = req.params.nestId
  const result = await getNest(nestId)
  inMemoryDB.loadNest(nestId)
  res.status(200).send(result)
})

apiRouter.get('/wsm/:nestId/:server', async (req, res) => {
  const nestId = req.params.nestId
  const server = decodeURI(req.params.server)
  const result = await getWSMessages(nestId, server)
  res.status(200).send(result)
})

// apiRouter.get('/nests/e/:nestId', async (req, res) => {
//   const nestId = req.params.nestId
//   const response = inMemoryDB('exist', nestId)
//   res.status(200).send(response)
// })

// to delete later? 
// apiRouter.get('/nests/all', async (req, res) => {
//   const nestId = req.params.nestId
//   const nests = inMemoryDB('getAll', nestId)
//   res.status(200).send(nests)
// })

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
    const closeWSClient = initializeCustomWSClient(wsServerURL, nestId)
    wsConnections[nestId] = closeWSClient
    // const result = inMemoryDB('newWSConnection', nestId, null, null, wsServerURL)
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