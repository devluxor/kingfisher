import { Router } from "express";
import { temporaryNestIdValidator } from "../utils/middleware.js";
import DBSimulator from "./DBSimulator.dev.js";
import initializeWSServer from "./wsServer.js";
import { dateFormatter } from "../utils/others.js";

const nestRouter = Router()
const wsClients = initializeWSServer()

// This route represents the main endpoint
nestRouter.all('/:nestId*', temporaryNestIdValidator, async (req, res) => {
  const nestId = req.params.nestId
  const method = req.method
  const path = req.params[0]
  const headers = req.headers
  const body = req.body
  const timeOfArrival = new Date()
  // let request = await requestService.createRequest(nestId, method, path, headers, body)
  const requestInfo = { nestId, timeOfArrival, method, path, headers, body } // add path later

  DBSimulator('addReq', nestId, null, requestInfo)

  const clients = wsClients()
  if (clients[nestId]) {
    console.log('🌈message sent from the server!')
    clients[nestId].send(`${dateFormatter(timeOfArrival)}, ${method}, ${path}, ${JSON.stringify(body)}`)
  }

  res.status(200).send('Request received')
})

export default nestRouter
