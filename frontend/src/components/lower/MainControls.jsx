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
        <button><CopyNestIcon/></button>
        <button onClick={() => testRequest(currentNest.id)}><SendTestRequestIcon/></button>
        <button onClick={resetCurrentNest}><NewNestIcon/></button>
        <WSSwitch wsToggleOn={wsToggleOn} toggleWSConnectionPanel={toggleWSConnectionPanel}/>
      </div>

      <div className="messages-control-and-flash-panel">

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
          
          {!connectionEstablished && <button onClick={e => connectionOn(e)}>Connect</button>}
          {connectionEstablished && <button onClick={e => connectionOff(e)}>Disconnect</button>}
          {/* {connectionEstablished && <button>Copy WS Server URL </button>} */}
          </form>
        </div>

        <div className="flash-message"
        >
          WS Connection: OK
        </div>

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

const CopyNestIcon = () => {
  return (
<svg className="copy-nest-icon" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 438 511.52"><path fillRule="nonzero" d="M141.44 0h172.68c4.71 0 8.91 2.27 11.54 5.77L434.11 123.1a14.37 14.37 0 0 1 3.81 9.75l.08 251.18c0 17.62-7.25 33.69-18.9 45.36l-.07.07c-11.67 11.64-27.73 18.87-45.33 18.87h-20.06c-.3 17.24-7.48 32.9-18.88 44.29-11.66 11.66-27.75 18.9-45.42 18.9H64.3c-17.67 0-33.76-7.24-45.41-18.9C7.24 480.98 0 464.9 0 447.22V135.87c0-17.68 7.23-33.78 18.88-45.42C30.52 78.8 46.62 71.57 64.3 71.57h12.84V64.3c0-17.68 7.23-33.78 18.88-45.42C107.66 7.23 123.76 0 141.44 0zm30.53 250.96c-7.97 0-14.43-6.47-14.43-14.44 0-7.96 6.46-14.43 14.43-14.43h171.2c7.97 0 14.44 6.47 14.44 14.43 0 7.97-6.47 14.44-14.44 14.44h-171.2zm0 76.86c-7.97 0-14.43-6.46-14.43-14.43 0-7.96 6.46-14.43 14.43-14.43h136.42c7.97 0 14.43 6.47 14.43 14.43 0 7.97-6.46 14.43-14.43 14.43H171.97zM322.31 44.44v49.03c.96 12.3 5.21 21.9 12.65 28.26 7.8 6.66 19.58 10.41 35.23 10.69l33.39-.04-81.27-87.94zm86.83 116.78-39.17-.06c-22.79-.35-40.77-6.5-53.72-17.57-13.48-11.54-21.1-27.86-22.66-48.03l-.14-2v-64.7H141.44c-9.73 0-18.61 4-25.03 10.41C110 45.69 106 54.57 106 64.3v319.73c0 9.74 4.01 18.61 10.42 25.02 6.42 6.42 15.29 10.42 25.02 10.42H373.7c9.75 0 18.62-3.98 25.01-10.38 6.45-6.44 10.43-15.3 10.43-25.06V161.22zm-84.38 287.11H141.44c-17.68 0-33.77-7.24-45.41-18.88-11.65-11.65-18.89-27.73-18.89-45.42v-283.6H64.3c-9.74 0-18.61 4-25.03 10.41-6.41 6.42-10.41 15.29-10.41 25.03v311.35c0 9.73 4.01 18.59 10.42 25.01 6.43 6.43 15.3 10.43 25.02 10.43h225.04c9.72 0 18.59-4 25.02-10.43 6.17-6.17 10.12-14.61 10.4-23.9z"/></svg>
  )
}

// const SendTestRequestIcon = () => {
//   return (

// <svg className="send-test-request-icon" height="100" viewBox="0 0 100 100" width="100" xmlns="http://www.w3.org/2000/svg"><g><path d="m44.3222087 70.4438714 52.3985134-63.9434163-13.8918386 77.4534284z"/><path d="m30.345267 66.1268204 9.7190534 28.4745146 4.8722694-24.8237258 52.1850728-64.16049755z"/><path d="m2.00182039 55.1708131 94.47451461-49.22330096-65.8434467 60.03094656z"/><path d="m40.6550364 93.530264 19.0212379-17.7114685-14.920358-5.167855z"/></g></svg>
// )
// }

export const SendTestRequestIcon = ({
  height = "1.6em",
  strokeWidth = "2",
  fill = "none",
  focusable = "false",
  ...props
}) => (
  <svg
    className="send-test-request-icon"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={height}
    focusable={focusable}
    {...props}
  >
    <path
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="m22 2l-7 20l-4-9l-9-4Zm0 0L11 13"
    />
  </svg>
);

export const NewNestIcon = ({
  height = "1.6rem",
  strokeWidth = "2",
  fill = "none",
  focusable = "false",
  ...props
}) => (
  <svg
    className="new-nest-icon"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={height}
    focusable={focusable}
    {...props}
  >
    <g
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 12h8m-4-4v8" />
    </g>
  </svg>
);


export default MainControls