import {WebSocket, WebSocketServer} from "ws";
import { generateId, isJson, isValidWSURL } from "../utils/others.js";
import { storeWSMessage } from "./db-service.js";

let frontendWSClients = {}
// 2: this server will send messages to ws client in frontend app
// for it to upload the DOM with the newly arrived messages
const wsLocalServer = new WebSocketServer({port: 9090})

wsLocalServer.on('connection', (ws, request) => {
  console.log('📯 Frontend App connected with backend ws server for custom ws connections!!!!')
  const nestId = request.url.split('=')[1]
  frontendWSClients[nestId] = ws

  ws.on('message', (message) => {
    const clientData = JSON.parse(message.toString())
    console.log('📩 Message received from frontend app!, updater connection ws backend(server)-frontend(client) established', clientData)

    // frontendWSClients[clientData.nestId] = ws
  });
})

// 1: this client will receive messages from the external WS server
// located using the URL introduced in the frontend input
export const initializeCustomWSConnectionClient = (wsServerURL, nestId) => {
  console.log(wsServerURL)
  
  if (!isValidWSURL(wsServerURL)) {
    console.error('WebSocket error: INVALID WS SERVER URL')
    return
  };
  
  const ws = new WebSocket(wsServerURL)
  
  ws.addEventListener("open", () => {
    console.log(`🏠WS Custom Client Created in Backend!`)
  })
  
  ws.addEventListener("error", (event) => {
    const clients = (() => frontendWSClients)();
    console.error("WebSocket error: ", event.error);
    setTimeout(() => clients[nestId].send(JSON.stringify({error: event.error})), 2000)
    ws.close()
  });

  ws.addEventListener("message", async (event) => {
    const clients = (() => frontendWSClients)();
    const messageData = isJson(event.data) ? JSON.parse(event.data) : event.data
    console.log(event.data)
    const processedMessageData = {
      id: generateId(),
      nestId,
      serverURL: wsServerURL, 
      data: messageData,
      arrivedOn: new Date(),
    }
    
    console.log('🚀 MESSAGE FROM EXTERNAL WS SERVER RECEIVED', processedMessageData)
    await storeWSMessage(processedMessageData)
    try {
      clients[nestId].send(JSON.stringify(processedMessageData))
    } catch (e) {
      console.log('🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭🎭')
      console.log(`nest with id ${nestId} not found in clients or clients` )
      console.error(e)
    }
  })

  ws.addEventListener('close', () => {
    console.log('connection with external ws server closed')
    const clients = (() => frontendWSClients)();
    if (clients[nestId]) {
      clients[nestId].terminate()
    }
  })
  
  return ws
}