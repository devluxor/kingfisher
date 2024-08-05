import { useEffect, useState, useRef } from "react"
import { createNest, testRequest } from "./services/testApi"
import axios from "axios"

function App() {
  const [currentNest, setCurrentNest] = useState(null)
  const connection = useRef(null)
  
  // will create a custom hook useCreateNest if not in storage
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    (async () => {
      try {
        const result = await createNest(source)
        setCurrentNest(result.nestId)
      } catch(error) {
        // console.error(error)
      }
    })()

    return () => source.cancel()
  }, [])

  useEffect(() => {
    if (!currentNest) {
      return
    }

    const ws = new WebSocket("ws://localhost:8080")

    // Connection opened
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({
        status: 'WS Connection established from client', 
        connected: true, 
        nestId: currentNest
      }))

    })
    const closeConnection = () => ws.close(1000, currentNest)
    addEventListener("beforeunload", () => {
      closeConnection()
    });



    // Listen for messages
    ws.addEventListener("message", (event) => {
      const request = document.createElement('li');
      request.className = 'request';
      request.textContent = event.data;
      document.querySelector('#received-requests').append(request);
      console.log("Message from server ", event.data)
    })

    connection.current = ws
    return () => {
      // ws.close(1000, currentNest)
      // ws.removeEventListener("open", onOpenHandler);
      // ws.removeEventListener("message", onMessageHandler);
    }
  }, [currentNest])

  const test = async (nestId) => {
    try {
      await testRequest(nestId)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h1>🐦Welcome to Kingfisher!🐦</h1>
      <h3>Current nest id: {currentNest ? currentNest : 'loading id'}</h3>
      <button onClick={() => test(currentNest)} >Make test request</button>
      <h4>List of received requests:</h4>
      <ul id="received-requests"></ul>
    </>
  )
}

export default App
