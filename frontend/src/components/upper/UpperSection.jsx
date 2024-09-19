import { sortDescending } from "../../utils/helpers"

const UpperSection = ({
  requests, 
  activeRequestId, 
  setActiveRequestId,
  messages,
  activeMessageId,
  setActiveMessageId
}) => {
  import.meta.env.DEV && console.log('UpperSection RENDERED')

  sortDescending(requests)
  sortDescending(messages)

  const newRequestId = requests[0]?.id
  const newMessageId = messages[0]?.id


  const activateRequest = (id) => {
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
      data-method={r.method}
      className={`
        request 
        ${r.id === activeRequestId ? 'active' : ''} 
        ${r.id === newRequestId? 'new' : 'slide-right' } 
      `}
    ></div>
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
      ></div>
  )
}

export default UpperSection