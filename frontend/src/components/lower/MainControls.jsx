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
          <label htmlFor="wsServerURL"><WSConnectionIcon/></label><br/>
          <input 
            type="text" 
            id="wsServerURL" 
            value={wsServerURL} 
            name="wsServerURL" 
            placeholder="WebSocket Server URL" 
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

const WSConnectionIcon = () => {
  return (
    <svg className="ws-icon" width="60px" height="60px" viewBox="0 -31.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
        <g>
          <path d="M192.440223,144.644612 L224.220111,144.644612 L224.220111,68.3393384 L188.415329,32.5345562 L165.943007,55.0068785 L192.440223,81.5040943 L192.440223,144.644612 L192.440223,144.644612 Z M224.303963,160.576482 L178.017688,160.576482 L113.451687,160.576482 L86.954471,134.079266 L98.1906322,122.843105 L120.075991,144.728464 L165.104487,144.728464 L120.746806,100.286931 L132.06682,88.9669178 L176.4245,133.324599 L176.4245,88.2961022 L154.622994,66.4945955 L165.775303,55.3422863 L110.684573,0 L56.3485097,0 L56.3485097,0 L0,0 L31.6960367,31.6960367 L31.6960367,31.7798886 L31.8637406,31.7798886 L97.4359646,31.7798886 L120.662954,55.0068785 L86.7029152,88.9669178 L63.4759253,65.7399279 L63.4759253,47.7117589 L31.6960367,47.7117589 L31.6960367,78.9046839 L86.7029152,133.911562 L64.3144448,156.300033 L100.119227,192.104815 L154.45529,192.104815 L256,192.104815 L256,192.104815 L224.303963,160.576482 L224.303963,160.576482 Z" >
          </path>
        </g>
    </svg>
  )
}

export default MainControls