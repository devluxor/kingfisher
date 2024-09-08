import { useState } from "react"
import { isValidWSURL } from "../../utils/helpers"

const MainControls = ({currentNest, testRequest, setWsServerURL, connectionEstablished, createConnection, closeConnection, wsServerURL, resetCurrentNest}) => {
  const [wsToggleOn, setWsToggleOn] = useState(s => s)

  const connectionOn = (e) => {
    e.preventDefault()
    if (!isValidWSURL(wsServerURL)) return
    
    
    createConnection()
  }

  const connectionOff = (e) => {
    e.preventDefault()

    setWsServerURL('')
    closeConnection()
    toggleWSConnectionPanel()
  }

  const toggleWSConnectionPanel = () => {
    const wsPanel = document.querySelector('.expandable')
    if (wsToggleOn) {
      wsPanel.classList.add('invisible')
      setTimeout(() => wsPanel.classList.remove('visible'), 100)
      setWsToggleOn(s => !s)
    } else {
      wsPanel.classList.add('visible')
      setTimeout(() => wsPanel.classList.remove('invisible'), 100)

      setWsToggleOn(s => !s)
    }
    console.log(wsToggleOn)
  }

  return (
    <div className='main-control-area'>
      {/* <div className='requests-control'>
      </div> */}
      <div className='main-controls'>
        <button>Copy nest id</button>
        <button onClick={() => testRequest(currentNest.id)}>Generate test request</button>
        <button onClick={resetCurrentNest}>New nest</button>
        <button onClick={toggleWSConnectionPanel}>toggle WS</button>
      </div>
      <div className='messages-control expandable'>
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
         {connectionEstablished && <button>Copy WS Server URL </button>}
        </form>
      </div>
    </div>
  )
}

export default MainControls