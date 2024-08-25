export const createWSClient = (currentNestId, wsServerURL, setter) => {
  const isCustomWSServer = !!wsServerURL

  if (!wsServerURL) {
    wsServerURL = import.meta.env.DEV ? `ws://localhost:8080` : `wss://kingfisher.luxor.dev/ws`
  } 

  const ws = new WebSocket(wsServerURL)

  // message related handlers:
  const onOpenConnection = () => {
    console.log(`📯WS${isCustomWSServer? ' Custom' : ''} Client Created!`)
    console.log(`📯Connection to WS${isCustomWSServer? ' Custom' : ''} Server Enabled!`)

    ws.send(JSON.stringify({
      status: `WS Connection established from${isCustomWSServer? ' Custom' : ''} Client`,
      connected: true,
      nestId: currentNestId
    }))
  }

  const onMessageReceived = (event) => {
    console.log(`📩 Message received from WS${isCustomWSServer? ' Custom' : ''} Server!`)

    const messageData = isJson(event.data) ? JSON.parse(event.data) : event.data
    console.log(messageData)
    const processedMessageData = {
      ...(messageData?.id || {id: Math.floor(Math.random() * 1000)}),
      ...(messageData?.arrivedOn || {arrivedOn: new Date()}),
      ...messageData
    }
    
    setter((previousState) => [...(previousState ? previousState : []), processedMessageData])
  }
  
  const closeConnection = () => ws.close(1000, currentNestId)
  
  // adds the handlers
  ws.addEventListener("open", onOpenConnection)
  ws.addEventListener("message", onMessageReceived)
  document.addEventListener("beforeunload", closeConnection)

  return ws
}

const isJson = (item) => {
  let value = typeof item !== "string" ? JSON.stringify(item) : item;

  try {
    value = JSON.parse(value);
  } catch (e) {
    return false;
  }
    
  return typeof value === "object" && value !== null;
}