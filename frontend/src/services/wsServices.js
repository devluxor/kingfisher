import { isJSON, isRequest } from "../utils/helpers"

const developmentMode = import.meta.env.DEV

// add error handler as fourth parameter ??
export const createWSClient = (currentNestId, wsServerURL, setter, errorHandler) => {
  const isCustomWSServer = !!wsServerURL

  if (!wsServerURL) {
    wsServerURL = developmentMode ? 
      `ws://localhost:8080?nestId=${currentNestId}` : 
      `wss://kingfisher.luxor.dev/ws?nestId=${currentNestId}`
  } 

  // connects to ws server in backend (either for the request ws connection, or custom-external ws connection)
  const ws = new WebSocket(wsServerURL)

  // message related handlers:
  const onOpenConnection = () => {
    developmentMode && console.log(`📯WS${isCustomWSServer? ' Custom' : ''} Client Created!`)
    developmentMode && console.log(`📯Connection to WS${isCustomWSServer? ' Custom' : ''} Server Enabled!`)

    ws.send(JSON.stringify({
      status: `WS Connection established from${isCustomWSServer? ' Custom' : ''} Client`,
      connected: true,
      nestId: currentNestId
    }))
  }

  const onMessageReceived = (event) => {
    developmentMode && console.log(`📩 Message received from WS${isCustomWSServer? ' Custom' : ''} Server!`)
    const message = isJSON(event.data) ? JSON.parse(event.data) : {data: event.data}
    developmentMode && console.log(message)


    if (message.error) {
      developmentMode && console.log('ERROR IN CONNECTION 🦎🦎🦎🦎🦎🦎🦎🦎🦎🦎🦎🦎')
      errorHandler(true)
      ws.close()
      return
    }

    const isRequestMessage = isRequest(message)
    const elements = document.querySelectorAll(`.${isRequestMessage? 'request' : 'message'}`);
    elements.forEach((element) => {
      element.classList.remove('new');
      element.classList.remove(`slide-${isRequestMessage? 'right' : 'left'}`);
      setTimeout(() => {
        element.classList.add(`slide-${isRequestMessage? 'right' : 'left'}`);
      }, 20)
    });

    setter((previousState) => [message, ...(previousState ? previousState : [])])
  }
  
  const closeConnection = () => ws.close(1000, currentNestId)
  
  // adds the handlers
  ws.addEventListener("open", onOpenConnection)
  ws.addEventListener("message", onMessageReceived)
  document.addEventListener("beforeunload", closeConnection)

  return ws
}

export const createRequestUpdaterWSConnection = async (currentNestId, setRequests) => {
  createWSClient(currentNestId, null, setRequests)
}
