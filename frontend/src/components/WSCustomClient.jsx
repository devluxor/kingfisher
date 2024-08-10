import { useState, useRef, useEffect } from "react"
import { createWSClient } from "../services/wsServices"

const WSCustomClient = ({currentNestId}) => {
  const [wsServerURL, setWsServerURL] = useState('')
  const [messages, setMessages] = useState([])
  const connection = useRef(null)
  const [cleanupWS, setCleanupWS] = useState(null)
  const [connectionEstablished, setConnectionEstablished] = useState(() => !!cleanupWS)

  return (
    <div>
      <h4>Custom WS Client</h4>
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          console.log('trying to connect to:', wsServerURL)
          const cleanUpFunction = createWSClient(currentNestId, wsServerURL, connection, setMessages)
          setConnectionEstablished(true)
          setCleanupWS(cleanUpFunction)
        }}
      >
        <label htmlFor="wsServerURL">Target WS Server URL</label><br/>
        <input 
          type="text" 
          id="wsServerURL" 
          value={wsServerURL} 
          name="wsServerURL" 
          placeholder="Enter url here" 
          required
          onChange={e => setWsServerURL(e.target.value)}
        ></input><br/>
        <input type="submit" value="Connect to WS server"></input>
      </form>
      
      {connectionEstablished ? <MessagesList messages={messages}/> : 'no ws connection'}
      {cleanupWS && <button onClick={cleanupWS}>Close Connection</button>}
    </div>
  )
}

const MessagesList = ({messages}) => {
  return (
    <>
    {messages.length > 0 ? 
      <ul id="received-messages">{messages.map(m => <li key={m.id}>{JSON.stringify(m.timeOfArrival)}: {m.message}</li>)}</ul> 
      : 'no messages yet '
    }
    </>
  )
}

export default WSCustomClient