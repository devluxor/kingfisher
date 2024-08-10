export const createWSClient = (currentNestId, wsServerURL, connection, setter) => {
  const isMockWSClient = wsServerURL !== null

  if (!isMockWSClient) {
    wsServerURL = import.meta.env.DEV ? `ws://localhost:8080` : `wss://kingfisher.luxor.dev/ws`
  }

  const ws = new WebSocket(wsServerURL)

  // message related handlers:
  const onOpenConnection = () => {
    console.log(`📯WS${isMockWSClient? ' Mock' : ''} Client Created!`)
    console.log(`📯Connection to WS${isMockWSClient? ' Mock' : ''} Server Enabled!`)

    ws.send(JSON.stringify({
      status: `WS Connection established from${isMockWSClient? ' Mock' : ''} Client`, 
      connected: true,
      nestId: currentNestId
    }))
  }

  const onMessageReceived = (event) => {
    console.log(`📩 Message received from WS${isMockWSClient? ' mock' : ''} Server!`)
    // const listElement = document.createElement('li');
    // listElement.className = isMockWSClient? 'message' : 'request';
    // const elementData = isMockWSClient? event.data : JSON.parse(event.data)
    const messageData = JSON.parse(event.data)
    const processedMessageData = {
      ...(messageData?.id || {id: Math.floor(Math.random() * 1000)}),
      ...(messageData?.timeOfArrival || {timeOfArrival: new Date()}),
      ...messageData
    }
    // listElement.textContent = isMockWSClient? elementData: elementData.timeOfArrival;
    // document.querySelector(`#received-${isMockWSClient? 'messages' : 'requests'}`).append(listElement);
    // if (!isMockWSClient) {
    setter((previousState) => [...previousState, processedMessageData])
    // }
  }

  const closeConnection = () => ws.close(1000, currentNestId)
  
  // adds the handlers
  ws.addEventListener("open", onOpenConnection)
  ws.addEventListener("message", onMessageReceived)
  document.addEventListener("beforeunload", closeConnection)

  connection.current = ws

  return () => {
    console.log(`WS ${isMockWSClient? 'Mock' : ''} CleanUp Function Working!`)
    // ws.removeEventListener("open", onOpenConnection)
    // ws.removeEventListener("message", onMessageReceived)
    // document.removeEventListener('beforeunload', closeConnection)
  }
}