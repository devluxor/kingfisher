import { Router } from "express";
import config from "../utils/config.js";
import { WebSocketServer } from "ws";
import { temporaryNestIdValidator } from "../utils/middleware.js";
import { nestDBSimulator, nests } from "./apiRouter.js";

const nestRouter = Router()
const clients = {}

nestRouter.all('/:nestId', temporaryNestIdValidator, async (req, res) => {
  const nestId = req.params.nestId;
  const method = req.method;
  const headers = req.headers;
  const body = req.body;
  // let request = await requestService.createRequest(nestId, method, path, headers, body)
  const requestInfo = { nestId, method, headers, body } // add path later
  
  // if (nests[nestId]) {
  //   nests[nestId].requests.push(requestInfo)
  // }

  nestDBSimulator('addReq', nestId, null, requestInfo)

  if (clients['id1']) {
    console.log('🌈message sent!')
    clients['id1'].send(`${new Date().toString().slice(0,25)}, ${method}, ${JSON.stringify(body)}`);
  }

  res.status(200).send('Request received');
})

const wsServer = new WebSocketServer({port: config.WS_PORT});
wsServer.on("connection", (ws, req) => {
  console.log('📯 Web Socket Server connected!')
  // let nestId;

  // does this mean that when a connection is made from the frontend,
  // a message is sent to this server with the id???

  // ws.on('message', (message) => {
    // nestId = message.toString();
    clients['id1'] = ws;
  // });
  
  ws.on("close", () => {
    console.log('✖ Web Socket Server closed!')
    delete clients['id1']
  });
})

export default nestRouter