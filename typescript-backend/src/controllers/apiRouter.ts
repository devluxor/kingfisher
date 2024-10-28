import { NextFunction, Request, Response, Router } from "express";
import { initializeCustomWSConnectionClient, isConnectionWithFrontendReady } from "../services/externalWSConnection.js";
import { getNest, getWSMessages, storeNest } from '../services/db-service.js'
import { generateId } from "../utils/others.js";
import { WebSocket } from "ws";
import { WSClientsList } from "../@types/services.js";

const apiRouter = Router()

apiRouter.get('/nests/:nestId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nestId = req.params.nestId
    const result = await getNest(nestId)
    res.status(200).send(result)
  } catch (e) {
    next(e);
  }
})


apiRouter.get('/wsm/:nestId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nestId = req.params.nestId
    const serverURL = req.headers['x-kingfisher-wsserverurl']
    if (typeof serverURL != 'string') {
      throw new TypeError('No websocket server url provided')
    }

    const result = await getWSMessages(nestId, serverURL)
    res.status(200).send(result)
  } catch (e) {
    next(e);
  }
})

apiRouter.post('/createNest', async (req: Request, res: Response, next: NextFunction) => {

  try {
    const nestId = generateId()
    let originIp = req.headers['x-forwarded-for'] || req.ip
    if (Array.isArray(originIp)) {
      originIp = originIp[0]
    } else if (typeof originIp != 'string') {
      originIp = 'unknown'
    }

    const newNest = {
      id: nestId, 
      createdOn: new Date(), 
      originIp
    }

    await storeNest(nestId, newNest.originIp)
    res.status(201).send(newNest)
  } catch (e) {
    next(e);
  }
})

// custom ws connections for external ws server - kingfisher backend client
// (there can only be one custom connection per nest)
const wsConnections:WSClientsList = {}

apiRouter.post('/createWsConnection', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nestId = req.body.nestId
    const wsServerURL = req.body.wsServerURL
    const connectionReady = await isConnectionWithFrontendReady(nestId)
    const ws = initializeCustomWSConnectionClient(wsServerURL, nestId)
    if (!ws) {
      throw new TypeError("Websocket client not initialized")
    }

    if (connectionReady) {
      wsConnections[nestId] = ws
      res.status(201).send({nestId})
    }


  } catch (e) {
    next(e);
  }
})

apiRouter.post('/closeWsConnection/:nestId', async (req: Request, res: Response, next: NextFunction) => {
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