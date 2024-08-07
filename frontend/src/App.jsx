import { useEffect, useState, useRef } from "react"
import { createNest, testRequest } from "./services/testApi"
import WSCustomClient from "./components/WSCustomClient"


import axios from "axios"

function App() {
  const [currentNestId, setCurrentNestId] = useState(localStorage.kingfisherCurrentNest)
  const connection = useRef(null)
  
  // will create a custom hook useCreateNest if not in storage
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    (async () => {
      try {
        const result = await createNest(source)
        if (!result || localStorage.kingfisherCurrentNest) return

        setCurrentNestId(result.nestId)
        localStorage.setItem('kingfisherCurrentNest', result.nestId)
      } catch(error) {
        console.error(error)
      }
    })()

    return () => source.cancel()
  }, [])

  useEffect(() => {
    if (!currentNestId) return
    
    const wsServerURL = import.meta.env.DEV ? `ws://localhost:8080` : `wss://kingfisher.luxor.dev/ws`
    const ws = new WebSocket(wsServerURL)

    // message related handlers:
    const onOpenConnection = () => {
      ws.send(JSON.stringify({
        status: 'WS Connection established from client', 
        connected: true, 
        nestId: currentNestId
      }))
    }
    const onMessageReceived = (event) => {
      const request = document.createElement('li');
      request.className = 'request';
      request.textContent = event.data;
      document.querySelector('#received-requests').append(request);
      console.log("Message from server ", event.data)
    }
    const closeConnection = () => ws.close(1000, currentNestId)

    // Connection opened
    ws.addEventListener("open", onOpenConnection)
    
    // Listen for messages
    ws.addEventListener("message", onMessageReceived)

    // When WS connection is closed
    document.addEventListener("beforeunload", closeConnection)

    connection.current = ws

    return () => {
      ws.removeEventListener("open", onOpenConnection)
      ws.removeEventListener("message", onMessageReceived)
      document.removeEventListener('beforeunload', closeConnection)
    }
  }, [currentNestId])

  const resetCurrentNestId = async () => {
    localStorage.removeItem('kingfisherCurrentNest')
    try {
      const result = await createNest()
      setCurrentNestId(result.nestId)
      deleteRequestsFromList()
      localStorage.setItem('kingfisherCurrentNest', currentNestId)

    } catch (error) {
      console.error(error)
    }
  }

  const deleteRequestsFromList = () => {
    const list = document.getElementById("received-requests");
    while (list.firstChild) {
      list.removeChild(list.lastChild);
    }
  }

  const test = async (nestId) => {
    try {
      await testRequest(nestId)
    } catch (error) {
      console.error(error)
    }
  }

  const copyNestId = async (currentNestId) => {
    try {
      await navigator.clipboard.writeText(currentNestId)
      console.log('Text copied to clipboard');
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  }

  return (
    <>
      <h1>🐦Welcome to Kingfisher!🐦</h1>

      <h3 style={{display: 'inline'}}> {currentNestId ? `Current nest id: ${currentNestId}` : 'loading nest'}</h3>
      <button
        onClick={() => copyNestId(currentNestId)}
      >Copy nest id</button>

      <button onClick={() => test(currentNestId)}>Make test request</button>
      <button style={{background: 'red'}} onClick={() => resetCurrentNestId()}>Reset Current Nest</button>

      <h4>List of received requests:</h4>
      <ul id="received-requests"></ul>

      {currentNestId ? <WSCustomClient currentNestId = {currentNestId}/> : 'loading nest'}
    </>
  )
}

export default App
