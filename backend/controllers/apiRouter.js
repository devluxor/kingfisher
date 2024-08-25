import { Router } from "express";
import short from 'short-uuid';
import DBSimulator from "../DBSimulator.dev.js";
import { initializeCustomWSClient } from "../externalWSConnection.js";
import { createNest, getNest, getWSMessages } from '../services/db-service.js'

const apiRouter = Router()

apiRouter.get('/sqlnest/:nestId', async (req, res) => {
  const nestId = req.params.nestId
  // const response = DBSimulator('exist', nestId)
  const result = await getNest(nestId)
  console.log(result)
  res.status(200).send(result)
})

apiRouter.get('/sqlmsg/:nestId/:server', async (req, res) => {
  const nestId = req.params.nestId
  const server = decodeURI(req.params.server)
  // const response = DBSimulator('exist', nestId)
  const result = await getWSMessages(nestId, 'https://echo.websocket.org/')
  console.log(result)
  res.status(200).send(result)
})

apiRouter.get('/nests/e/:nestId', async (req, res) => {
  const nestId = req.params.nestId
  const response = DBSimulator('exist', nestId)
  res.status(200).send(response)
})

// to delete later? 
apiRouter.get('/nests/all', async (req, res) => {
  const nestId = req.params.nestId
  const nests = DBSimulator('getAll', nestId)
  res.status(200).send(nests)
})

apiRouter.get('/nests/:nestId', async (req, res) => {
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
    const newNest = {
      id: nestId, 
      createdOn: new Date(), 
      ip: req.ip, 
      host: req.hostname, 
      requests: [],
      wsConnections: {},
    }
    DBSimulator('newNest', nestId, newNest)
    createNest(nestId, req.ip, req.hostname)
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
    const result = DBSimulator('newWs', nestId, null, null, wsServerURL)
    res.status(201).send({nestId: result})
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