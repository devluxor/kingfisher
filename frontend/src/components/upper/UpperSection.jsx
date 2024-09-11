import { sortDescending } from "../../utils/helpers"

const UpperSection = ({
  requests, 
  activeRequestId, 
  setActiveRequestId,
  messages,
  activeMessageId,
  setActiveMessageId
}) => {
  console.log('UpperSection RENDERED')

  sortDescending(requests)
  sortDescending(messages)

  const newRequestId = requests[0]?.id
  const newMessageId = messages[0]?.id

  const handleLeftArrow = () => {
    if (requests.length === 1) return

    const activeHTMLRequests = document.querySelectorAll('.request')
    let index 
    activeHTMLRequests.forEach((r, i) => {
      if (r.classList.contains('active')) {
        index = i
        return
      }
    })

    if (index === 0) return

    const newActiveRequestHTMLElement = activeHTMLRequests[index - 1]

    const activeRequest = requests.find(r => r.id.slice(0, 6) === newActiveRequestHTMLElement.id)
    setActiveRequestId(activeRequest.id)
  }

  const handleRightArrow = () => {
    if (requests.length === 1) return

    const activeHTMLRequests = document.querySelectorAll('.request')
    let index 
    activeHTMLRequests.forEach((r, i) => {
      if (r.classList.contains('active')) {
        index = i
      }
    })

    if (index === activeHTMLRequests.length - 1) return
    
    const newActiveRequestHTMLElement = activeHTMLRequests[index + 1]

    const activeRequest = requests.find(r => r.id.slice(0, 6) === newActiveRequestHTMLElement.id)

    activeHTMLRequests.forEach((r, i) => {
      r.classList.remove('active')
    })
    setActiveRequestId(activeRequest.id)
  }

  const keyHandler = (event) => {
    if (event.key === "ArrowLeft") {
      handleLeftArrow();
    } else if (event.key === "ArrowRight") {
      handleRightArrow();
    }
  }

  const activateRequest = (id) => {
    // document.removeEventListener('keydown', keyHandler)
    document.addEventListener('keydown', keyHandler)

    setActiveRequestId(id)
  }

  return (
    <section className='main-container upper'>
      <div className='arrived-elements requests'>
        {requests.map(r => {
          return <RequestListElement 
            key={r.id} 
            r={r} 
            activeRequestId={activeRequestId} 
            activateRequest={activateRequest}
            newRequestId={newRequestId}
          />
        })}
      </div>
      <div className='arrived-elements messages'>
        {messages.map(m => {
          return <MessageListElement 
            key={m.id}
            m={m}
            setActiveMessageId={setActiveMessageId}
            activeMessageId={activeMessageId}
            newMessageId={newMessageId}
          /> 
        })}
      </div>
    </section>
  )
}

const RequestListElement = ({r, activeRequestId, activateRequest, newRequestId}) => {
  return (
    <div 
      onClick={() => activateRequest(r.id)} 
      key={r.id}
      id={r.id.slice(0, 6)}
      className={`
        request red 
        ${r.id === activeRequestId ? 'active' : ''} 
        ${r.id === newRequestId? 'new' : 'slide-right' } 
      `}
    >R{r.id[0]}</div>
  )
}

const MessageListElement = ({m, activeMessageId, setActiveMessageId, newMessageId}) => {
  return (
    <div 
      onClick={() => setActiveMessageId(m.id)}
      className={`
        message
        ${m.id === activeMessageId ? 'active' : ''}        
        ${m.id === newMessageId ? 'new' : 'slide-left'}        
      `}
      >M{m.id[0]}</div>
  )
}

export default UpperSection