import { useState, useRef } from "react"
import { createWSClient } from "../services/wsServices"

const WSCustomClient = ({currentNest}) => {
  const [wsServerURL, setWsServerURL] = useState('')
  const connection = useRef(null)

  const deleteMessagesFromList = () => {
    const list = document.getElementById("received-messages");
    while (list.firstChild) {
      list.removeChild(list.lastChild);
    }
  }

  return (
    <div>
      <h4>Custom WS Client</h4>
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          console.log('trying to connect to:', wsServerURL)
          deleteMessagesFromList()
          createWSClient(currentNest, wsServerURL, connection)
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
      <ul id="received-messages"></ul>
    </div>
  )
}

export default WSCustomClient