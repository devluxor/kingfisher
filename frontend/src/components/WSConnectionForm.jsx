import { isValidWSURL } from "../utils/helpers"

const WSConnectionForm = ({createConnection, closeConnection, wsServerURL, setWsServerURL, connectionEstablished}) => {
  console.log('WSConnectionForm rendered')
    
  const connectionOn = (e) => {
    e.preventDefault()
    if (!isValidWSURL(wsServerURL)) return

    createConnection()
  }

  const connectionOff = (e) => {
    e.preventDefault()
    setWsServerURL('')
    closeConnection()
  }

  return (
    <form>
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
      {!connectionEstablished && <button onClick={e => connectionOn(e)}>Connect to WS server</button>}
      {connectionEstablished && <button onClick={e => connectionOff(e)}>Disconnect from WS Server</button>}
    </form>
  )
}

export default WSConnectionForm