import { Router } from "express";
import { temporaryNestIdValidator } from "../utils/middleware.js";
import initializeWSServer from "./requestsWSServer.js";
import { generateId } from "../utils/others.js";
import { storeRequest } from "../services/db-service.js";

const nestRouter = Router()
const wsClients = initializeWSServer()

nestRouter.all('/:nestId*', temporaryNestIdValidator, async (req, res) => {
  const nestId = req.params.nestId
  const method = req.method
  const path = req.params[0]
  const headers = req.headers
  const body = req.body
  const arrivedOn = new Date()
  const id = generateId()

  const processedRequest = { 
    id, 
    nestId, 
    path, 
    headers, 
    method, 
    body,
    arrivedOn, 
  }

  await storeRequest(processedRequest)
  const clients = wsClients()
  if (clients[nestId]) {
    console.log('🌈message sent from the server!')
    clients[nestId].send(JSON.stringify(processedRequest))
  }

  res.status(200).send('Request received')
})

export default nestRouter
