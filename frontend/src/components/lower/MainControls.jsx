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
  }

  const toggleWSConnectionPanel = () => {
    const wsPanel = document.querySelector('.expandable')
    if (wsToggleOn) {
      wsPanel.classList.add('invisible')
      setWsToggleOn(s => !s)
      setWsServerURL('')
      closeConnection()
    } else {
      wsPanel.classList.add('visible')
      wsPanel.classList.remove('invisible')
      setWsToggleOn(s => !s)
    }
  }

  return (
    <div className='main-control-area'>
      {/* <div className='requests-control'>
      </div> */}

      <div className='main-controls'>
        <button>Copy nest id</button>
        <button onClick={() => testRequest(currentNest.id)}>Generate test request</button>
        <button onClick={resetCurrentNest}>New nest</button>
        <WSSwitch wsToggleOn={wsToggleOn} toggleWSConnectionPanel={toggleWSConnectionPanel}/>
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
         {/* {connectionEstablished && <button>Copy WS Server URL </button>} */}
        </form>
      </div>

    </div>
  )
}

const WSSwitch = ({wsToggleOn, toggleWSConnectionPanel}) => {

  return (
    <div className="ws-toggle-container" onClick={toggleWSConnectionPanel}>
      <div 
        className={`ws-toggle-switch ${wsToggleOn ? 'on' : 'off'}`} 
      >
        <div 
          className={`ws-toggle-handle ${wsToggleOn ? 'on' : 'off'}`} 
        />
      </div>
    </div>
  );
};

export default MainControls