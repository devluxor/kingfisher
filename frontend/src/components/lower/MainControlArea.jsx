import { useState } from "react"
import { copyNestURL, isValidWSURL } from "../../utils/helpers"
import { NestHistory } from "./NestHistory"
import FlashMessage from "./FlashMessage"
import MessagesControl from "./MessagesControl"
import MainControlBar from "./MainControlBar"

const MainControlArea = ({
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
      <MainControlBar
        displayFlashMessage={displayFlashMessage}
        hideFlashMessage={hideFlashMessage}
        resetCurrentNest={resetCurrentNest}
        nestHistoryToggle={nestHistoryToggle}
        wsToggleOn={wsToggleOn}
        toggleWSConnectionPanel={toggleWSConnectionPanel}
        currentNest={currentNest}
        testRequest={testRequest}
        copyNest={copyNest}
        setNestHistoryToggle={setNestHistoryToggle}
      />

      <div className="messages-control-and-flash-panel">
        <MessagesControl
          connectionEstablished={connectionEstablished} 
          wsServerURL={wsServerURL} 
          setWsServerURL={setWsServerURL} 
          connectionOn={connectionOn} 
          connectionOff={connectionOff}
        />
 
        <NestHistory
          nestHistoryToggle={nestHistoryToggle}
          currentNest={currentNest}
          closeConnection={closeConnection} 
          setWsServerURL={setWsServerURL} 
          displayFlashMessage={displayFlashMessage}
          hideFlashMessage={hideFlashMessage}
        />

        <FlashMessage flashMessage={flashMessage}/>
      </div>
    </div>
  )
}



export default MainControlArea