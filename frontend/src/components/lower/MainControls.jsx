import { isValidWSURL } from "../../utils/helpers"

const MainControls = ({currentNest, testRequest, setWsServerURL, connectionEstablished, createConnection, closeConnection, wsServerURL, resetCurrentNest}) => {

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
    <div className='main-control-area'>
    <div className='requests-control'>
      <button>Copy nest id</button>
      <button onClick={() => testRequest(currentNest.id)}>Generate test request</button>
      <button onClick={resetCurrentNest}>New nest</button>
    </div>
    <div className='main-controls'>Controls</div>
    <div className='messages-control'>
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
    </div>
  </div>
  )
}

export default MainControls