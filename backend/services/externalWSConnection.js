import {WebSocket, WebSocketServer} from "ws";
import { generateId, isJson, isValidWSURL } from "../utils/others.js";
import { storeWSMessage } from "./db-service.js";
import config from "../utils/config.js";

let frontendWSClients = {}
// 2: this server will send messages to ws client in frontend app
// for it to upload the DOM with the newly arrived messages
const wsLocalServer = new WebSocketServer({port: config.WS_PORT_CUSTOM})

wsLocalServer.on('connection', (ws, request) => {
  console.log('📯 Frontend App connected with backend ws server for custom ws connections!!!!')
  const nestId = request.url.split('=')[1]
  frontendWSClients[nestId] = ws
})

// 1: this client will receive messages from the external WS server
// located using the URL introduced in the frontend input
export const initializeCustomWSConnectionClient = (wsServerURL, nestId) => {
  console.log(wsServerURL)
  
  if (!isValidWSURL(wsServerURL)) {
    logger.error('WebSocket error: INVALID WS SERVER URL')
    return
  };
  
  const ws = new WebSocket(wsServerURL)
  
  ws.addEventListener("open", () => {
    console.log(`🏠WS Custom Client Created in Backend!`)
  })
  
  ws.addEventListener("error", (event) => {
    const clients = (() => frontendWSClients)();
    logger.error("WebSocket error: ", event.error);
    setTimeout(() => clients[nestId]?.send(JSON.stringify({error: event.error})), 2000)
    ws.close()
  });

  ws.addEventListener("message", async (event) => {
    const clients = (() => frontendWSClients)();

    // extractor helper
    const messageData = isJson(event.data) ? JSON.parse(event.data) : event.data
    const processedMessage = {
      id: generateId(),
      nestId,
      serverURL: wsServerURL, 
      data: messageData,
      arrivedOn: new Date(),
    }
    
    console.log('🚀 MESSAGE FROM EXTERNAL WS SERVER RECEIVED', processedMessage)
    await storeWSMessage(processedMessage)
    clients[nestId]?.send(JSON.stringify(processedMessage))
  })

  ws.addEventListener('close', () => {
    console.log('connection with external ws server closed')
    const clients = (() => frontendWSClients)();
    clients[nestId]?.terminate()
  })
  
  return ws
}