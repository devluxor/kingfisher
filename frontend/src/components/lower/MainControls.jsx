import { useState } from "react"
import { copyNestURL, isValidWSURL, lastNests } from "../../utils/helpers"
import { useNavigate } from "react-router-dom"

const MainControls = ({
  currentNest,
  testRequest, 
  setWsServerURL, 
  connectionEstablished, 
  createConnection, 
  closeConnection, 
  wsServerURL, 
  resetCurrentNest,
  flashMessage,
  setFlashMessage
}) => {
  const [wsToggleOn, setWsToggleOn] = useState(s => s)
  const [nestHistoryToggle, setNestHistoryToggle] = useState(s => s)

  const connectionOn = (e) => {
    e.preventDefault()
    if (wsServerURL === '') {
      displayFlashMessage('No WS Server URL')
      setTimeout(() => hideFlashMessage(), 3000)
      return
    } else if (!isValidWSURL(wsServerURL)) {
      displayFlashMessage('Invalid WS Server URL')
      setTimeout(() => hideFlashMessage(), 3000)
      return
    }
    
    createConnection()
    if (flashMessage) return

    displayFlashMessage('WS Connection: OK')
    setTimeout(() => hideFlashMessage(), 5000)
  }
  
  const connectionOff = (e) => {
    e.preventDefault()
    
    // setWsServerURL('')
    closeConnection()
    if (flashMessage) return

    displayFlashMessage('WS Connection: OFF')
    setTimeout(() => hideFlashMessage(), 5000)
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

  const displayFlashMessage = (message, type) => {
    if (flashMessage) setFlashMessage(null)

    if (!document.querySelector('.nest-history.visible') && message.charAt(0) === '#') return

    setFlashMessage({message, type})
  }

  const hideFlashMessage = () => {
    if (flashMessage?.message.charAt(0) === '#') {
      setFlashMessage(null)
      return
    }

    setTimeout(
      () => setFlashMessage(null), 
      flashMessage?.type === 'hover'  ?
         50 : 1500
    )
  }

  const copyNest = () => {
    copyNestURL(currentNest.id)
    displayFlashMessage('Nest URL Copied')
    setTimeout(
      () => setFlashMessage(null), 4000)
  }

  return (
    <div className='main-control-area'>

      <div className='main-controls'>
        <button onClick={() => testRequest(currentNest.id)}>
          <SendIcon displayFlashMessage={displayFlashMessage} hideFlashMessage={hideFlashMessage}/>
        </button>
        <button
          onClick={copyNest}
        ><CopyIcon displayFlashMessage={displayFlashMessage} hideFlashMessage={hideFlashMessage}/></button>
        <button onClick={resetCurrentNest}><PlusCircleIcon  displayFlashMessage={displayFlashMessage} hideFlashMessage={hideFlashMessage} /></button>
        <button onClick={() => setNestHistoryToggle(s => !s)}>
          <ClockIcon nestHistoryToggle={nestHistoryToggle} displayFlashMessage={displayFlashMessage} hideFlashMessage={hideFlashMessage}/>
        </button>
        <WSIcon wsToggleOn={wsToggleOn} toggleWSConnectionPanel={toggleWSConnectionPanel} displayFlashMessage={displayFlashMessage} hideFlashMessage={hideFlashMessage} />
      </div>

      <div className="messages-control-and-flash-panel">

        <div className='messages-control expandable'>
          <form>
            <input
              readOnly={connectionEstablished}
              type="text" 
              id="wsServerURL" 
              value={wsServerURL} 
              name="wsServerURL" 
              placeholder="WebSocket Server URL" 
              required
              onChange={e => setWsServerURL(e.target.value)}
            ></input><br/>
          
          {!connectionEstablished && <button className="ws-connection" onClick={e => connectionOn(e)}>
            <PowerIcon/>
          </button>}
          {connectionEstablished && 
          <button className="ws-connection active" onClick={e => connectionOff(e)}>
            <PowerIcon/>
          </button>}
          </form>
        </div>

        <div className={`nest-history ${nestHistoryToggle ? 'visible' : ''}`}>
          <NestHistory
            currentNest={currentNest}
            closeConnection={closeConnection} 
            setWsServerURL={setWsServerURL} 
            displayFlashMessage={displayFlashMessage}
            hideFlashMessage={hideFlashMessage}
          />
        </div>

        <div 
          className={`flash-message ${flashMessage?.type === 'error' ? 'error' : ''} ${flashMessage ? 'visible' : ''}`}
          data-method={flashMessage?.type ? flashMessage.type : ''}
        >
          <h1
            className={`${flashMessage?.message.charAt(0) === '#' ? 'nest-url' : ''}`}
          >{flashMessage?.message}</h1>
        </div>


      </div>


    </div>
  )
}

const ClockIcon = ({nestHistoryToggle, displayFlashMessage, hideFlashMessage}) => (
  <svg
    onMouseEnter={() => displayFlashMessage('Last Visited Nests', 'hover')}
    onMouseLeave={hideFlashMessage}
    className={`nest-history-icon ${nestHistoryToggle ? 'active' : ''}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PlusCircleIcon = ({displayFlashMessage, hideFlashMessage}) => (
  <svg
    onMouseEnter={() => displayFlashMessage('Generate New Nest', 'hover')}
    onMouseLeave={hideFlashMessage}
    className="new-nest-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const SendIcon = ({displayFlashMessage, hideFlashMessage}) => (
  <svg
    className="send-test-request-icon"
    onMouseEnter={() => displayFlashMessage('Send Test Request', 'hover')}
    onMouseLeave={hideFlashMessage}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);

const CopyIcon = ({displayFlashMessage, hideFlashMessage}) => (
  <svg
    className="copy-nest-url-icon"
    onMouseEnter={() => displayFlashMessage('Copy Nest URL', 'hover')}
    onMouseLeave={hideFlashMessage}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const NestHistory = ({currentNest, closeConnection, setWsServerURL, displayFlashMessage, hideFlashMessage}) => {

  const nestIds = lastNests()

  return (
    <>
      {nestIds.map(n => {
        return (
          <NestInCache
            key={n} 
            nestId={n}
            currentNest={currentNest} 
            closeConnection={closeConnection} 
            setWsServerURL={setWsServerURL}
            displayFlashMessage={displayFlashMessage}
            hideFlashMessage={hideFlashMessage}
          />
        )
      })}
    </>
  )
}

const NestInCache = ({ currentNest, nestId, closeConnection, setWsServerURL, displayFlashMessage, hideFlashMessage}) => {
  const navigate = useNavigate()

  const goToCachedNest = () => {
    closeConnection()
    setWsServerURL('')
    navigate(`/${nestId}`)
  }

  return (
    <a
      onClick={goToCachedNest}
      onMouseEnter={() => displayFlashMessage(`#${nestId}`)}
      onMouseLeave={hideFlashMessage}
    >
      <CircleIcon currentNest={currentNest} nestId={nestId}/>
    </a>
  )
}


const CircleIcon = ({currentNest, nestId}) => (
  <svg
    className={`nest ${currentNest.id === nestId ? 'active' : ''}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const PowerIcon = () => (
  <svg
    className="ws-connection-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    <line x1="12" y1="2" x2="12" y2="12" />
  </svg>
);

const WSIcon = ({wsToggleOn, toggleWSConnectionPanel, displayFlashMessage, hideFlashMessage}) => {

  return (
    <svg
    onClick={toggleWSConnectionPanel}
    onMouseEnter={() => displayFlashMessage('WS Connection Panel', 'hover')}
    onMouseLeave={hideFlashMessage}
    className={`ws-panel-icon ${wsToggleOn ? 'active' : ''}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)};

export default MainControls