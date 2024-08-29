import inMemoryDB from "./inMemoryDB.js";
import {WebSocket, WebSocketServer} from "ws";
import { generateId, isJson } from "../utils/others.js";
import { storeWSMessage } from "./db-service.js";

let frontendWSClients = {}
// 2: this server will send messages to client in frontend app
// for it to upload the DOM
const wsLocalServer = new WebSocketServer({port: 9090})

wsLocalServer.on('connection', (ws) => {
  console.log('📯 Frontend App connected!')

  ws.on('message', (message) => {
    const clientData = JSON.parse(message.toString())
    console.log('📩 Message received from frontend app!', clientData)
    frontendWSClients[clientData.nestId] = ws
  });
})

// 1: this client will receive messages from the external WS server
export const initializeCustomWSClient = (wsServerURL, nestId) => {
  const clients = frontendWSClients
  const ws = new WebSocket(wsServerURL)
  
  ws.addEventListener("open", () => {
    console.log(`🏠WS Custom Client Created in Backend!`)
  })

  ws.addEventListener("message", async (event) => {
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
    inMemoryDB.addNewWSMessage(nestId, wsServerURL, processedMessageData)
    await storeWSMessage(processedMessageData)
    clients[nestId].send(JSON.stringify(processedMessageData))
  })

  ws.addEventListener('close', () => {
    console.log('connection with external ws server closed')
  })

  return ws
}